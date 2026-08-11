// Este código corre UNA SOLA VEZ, apenas se carga el bundle de JS —
// antes de que React monte ningún componente, incluido el SplashScreen.
//
// Por qué existe este archivo: Chrome dispara "beforeinstallprompt" muy
// temprano (apenas confirma que el sitio cumple los requisitos de PWA).
// Antes, el listener se registraba recién dentro de un useEffect del
// hook usePwaInstall, es decir, cuando InstallPwaButton se montaba. Como
// SplashScreen retrasa ese montaje ~2.2s, el evento casi siempre ya
// había disparado y se perdía para siempre en esa carga de página — el
// botón nunca se activaba, aunque el navegador sí ofreciera instalar
// desde su propio menú.
//
// Al vivir en un módulo aparte y ejecutarse a nivel superior (no dentro
// de un componente/efecto), este archivo se evalúa durante el import
// inicial — antes de que main.jsx llegue a llamar a render() — así que
// el listener siempre queda listo a tiempo, sin importar cuánto tarde
// en montar el resto de la app.

let deferredPrompt = null
let installed = false
const listeners = new Set()

function notificar() {
  listeners.forEach((callback) => callback())
}

function esDisplayStandalone() {
  if (typeof window === 'undefined') return false
  const mql = window.matchMedia?.('(display-mode: standalone)')
  const iosStandalone = window.navigator?.standalone === true // Safari iOS
  return Boolean(mql?.matches) || iosStandalone
}

if (typeof window !== 'undefined') {
  installed = esDisplayStandalone()

  window.addEventListener('beforeinstallprompt', (event) => {
    // Evita el mini-infobar automático del navegador: el control lo
    // tiene el botón propio de MisFinanzas.
    event.preventDefault()
    deferredPrompt = event
    notificar()
  })

  window.addEventListener('appinstalled', () => {
    installed = true
    deferredPrompt = null
    notificar()
  })
}

export function getDeferredPrompt() {
  return deferredPrompt
}

export function getIsInstalled() {
  return installed
}

export function markInstalled() {
  installed = true
  deferredPrompt = null
  notificar()
}

export function subscribe(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}
