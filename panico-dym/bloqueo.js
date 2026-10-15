import { VERSICULOS } from './datos.js';

let ultimo = -1;

function mostrarVersiculo() {
  let i;
  do { i = Math.floor(Math.random() * VERSICULOS.length); } while (i === ultimo && VERSICULOS.length > 1);
  ultimo = i;
  document.getElementById('texto').textContent = `«${VERSICULOS[i].texto}»`;
  document.getElementById('cita').textContent = VERSICULOS[i].cita;
}

document.getElementById('otro').addEventListener('click', mostrarVersiculo);

document.getElementById('salir').addEventListener('click', () => {
  location.replace('https://www.google.com');
});

let intervalo = null;
document.getElementById('orar').addEventListener('click', () => {
  const seccion = document.getElementById('oracion');
  const cuenta = document.getElementById('cuenta');
  seccion.hidden = false;
  clearInterval(intervalo);
  let s = 60;
  cuenta.textContent = s;
  intervalo = setInterval(() => {
    s -= 1;
    cuenta.textContent = s > 0 ? s : '🙏 Amén';
    if (s <= 0) clearInterval(intervalo);
  }, 1000);
});

mostrarVersiculo();
