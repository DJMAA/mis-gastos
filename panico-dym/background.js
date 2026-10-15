import { DOMINIOS, PALABRAS, HORARIO } from './datos.js';

const TIPOS = ['main_frame', 'sub_frame'];
const ACCION = { type: 'redirect', redirect: { extensionPath: '/bloqueo.html' } };

async function cargarConfig() {
  const c = await chrome.storage.local.get(['dominios', 'palabras', 'horario']);
  return {
    dominios: c.dominios ?? DOMINIOS,
    palabras: c.palabras ?? PALABRAS,
    horario: c.horario ?? HORARIO,
  };
}

function aMinutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function enHorario(horario, ahora = new Date()) {
  if (horario.modo === 'siempre') return true;
  const min = ahora.getHours() * 60 + ahora.getMinutes();
  const desde = aMinutos(horario.desde);
  const hasta = aMinutos(horario.hasta);
  if (desde === hasta) return true;
  // Un horario como 22:00–06:00 cruza la medianoche.
  return desde < hasta ? min >= desde && min < hasta : min >= desde || min < hasta;
}

async function aplicarReglas() {
  const c = await cargarConfig();
  const activo = enHorario(c.horario);
  const reglas = [];
  if (activo) {
    let id = 1;
    if (c.dominios.length) {
      reglas.push({ id: id++, priority: 1, action: ACCION, condition: { requestDomains: c.dominios, resourceTypes: TIPOS } });
    }
    for (const palabra of c.palabras) {
      reglas.push({ id: id++, priority: 1, action: ACCION, condition: { urlFilter: palabra, resourceTypes: TIPOS } });
    }
  }
  const actuales = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: actuales.map((r) => r.id),
    addRules: reglas,
  });
  await chrome.storage.local.set({ activoAhora: activo });
}

function iniciar() {
  chrome.alarms.create('horario', { periodInMinutes: 1 });
  aplicarReglas();
}

chrome.runtime.onInstalled.addListener(iniciar);
chrome.runtime.onStartup.addListener(iniciar);
chrome.alarms.onAlarm.addListener((a) => { if (a.name === 'horario') aplicarReglas(); });
chrome.storage.onChanged.addListener((cambios) => {
  if (cambios.dominios || cambios.palabras || cambios.horario) aplicarReglas();
});
