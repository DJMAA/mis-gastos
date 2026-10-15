import { DOMINIOS, PALABRAS, HORARIO } from './datos.js';

const $ = (id) => document.getElementById(id);

async function hash(texto) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Acepta "https://www.sitio.com/ruta" y deja solo "sitio.com".
function limpiarDominio(linea) {
  return linea.trim().toLowerCase()
    .replace(/^[a-z]+:\/\//, '')
    .replace(/^www\./, '')
    .split(/[/?#:]/)[0];
}

function lineas(texto, limpiar) {
  const vistos = new Set();
  for (const l of texto.split('\n')) {
    const v = limpiar(l);
    if (v) vistos.add(v);
  }
  return [...vistos];
}

let pinHash = null;

async function cargar() {
  const c = await chrome.storage.local.get(['dominios', 'palabras', 'horario', 'pinHash']);
  const horario = c.horario ?? HORARIO;
  $('dominios').value = (c.dominios ?? DOMINIOS).join('\n');
  $('palabras').value = (c.palabras ?? PALABRAS).join('\n');
  document.querySelector(`input[name=modo][value=${horario.modo}]`).checked = true;
  $('desde').value = horario.desde;
  $('hasta').value = horario.hasta;
  pinHash = c.pinHash ?? null;
  $('cajaPinActual').hidden = !pinHash;
}

function aviso(texto, color) {
  $('msg').textContent = texto;
  $('msg').style.color = color;
}

$('restaurar').addEventListener('click', () => {
  $('dominios').value = DOMINIOS.join('\n');
});

$('guardar').addEventListener('click', async () => {
  if (pinHash && (await hash($('pinActual').value)) !== pinHash) {
    aviso('PIN incorrecto.', '#c0392b');
    return;
  }
  const datos = {
    dominios: lineas($('dominios').value, limpiarDominio),
    // Solo letras, números y guiones: otros caracteres tienen significado especial en el filtro.
    palabras: lineas($('palabras').value, (l) => l.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')),
    horario: {
      modo: document.querySelector('input[name=modo]:checked').value,
      desde: $('desde').value || HORARIO.desde,
      hasta: $('hasta').value || HORARIO.hasta,
    },
  };
  const nuevo = $('pinNuevo').value.trim();
  if (nuevo) datos.pinHash = await hash(nuevo);
  await chrome.storage.local.set(datos);
  $('pinActual').value = '';
  $('pinNuevo').value = '';
  await cargar();
  aviso('Guardado ✔', '#2f7d4f');
});

cargar();
