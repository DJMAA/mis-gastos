chrome.storage.local.get('activoAhora').then(({ activoAhora }) => {
  document.getElementById('estado').textContent = activoAhora === false
    ? '⏸️ Fuera del horario: el bloqueo está en pausa.'
    : '✅ Protección activa.';
});

document.getElementById('opciones').addEventListener('click', () => chrome.runtime.openOptionsPage());
