import { useCallback, useEffect, useState } from 'react'

// Se guarda en localStorage para que, aunque el usuario reabra la app
// desde el navegador (no desde el ícono instalado) y por lo tanto el
// display-mode ya no sea "standalone", el botón siga sin aparecer.
const STORAGE_KEY = 'misfinanzas-pwa-installed'

function leerFlagInstalado() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    // Modo privado / localStorage bloqueado: no rompe la app, solo
    // hace que este "recordatorio" no persista entre sesiones.
    return false
  }
}

function guardarFlagInstalado() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Ignorado a propósito, ver comentario de arriba.
  }
}

function esDisplayStandalone() {
  if (typeof window === 'undefined') return false
  const mql = window.matchMedia?.('(display-mode: standalone)')
  const iosStandalone = window.navigator?.standalone === true // Safari iOS
  return Boolean(mql?.matches) || iosStandalone
}

function esDispositivoMovil() {
  if (typeof navigator === 'undefined') return false

  // API moderna de Chromium: la señal más confiable cuando existe.
  if (navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') {
    return navigator.userAgentData.mobile
  }

  const ua = navigator.userAgent || ''
  const uaEsMovil = /Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(ua)
  const tienePunteroTactil = window.matchMedia?.('(pointer: coarse)').matches ?? false

  // Se piden AMBAS señales (UA + puntero táctil) para no confundir una
  // laptop con pantalla táctil con un celular real.
  return uaEsMovil && tienePunteroTactil
}

/**
 * Encapsula todo el ciclo de vida de la instalación como PWA:
 * - Detecta si el dispositivo es móvil.
 * - Captura el evento nativo `beforeinstallprompt` (Chrome/Android) y
 *   evita que el navegador lo muestre por su cuenta.
 * - Expone `promptInstall` para abrir ese diálogo nativo bajo demanda.
 * - Detecta instalación ya sea por el evento `appinstalled` o porque la
 *   app ya se está ejecutando en modo standalone (ícono instalado).
 * - Recuerda la instalación entre sesiones para no volver a mostrar el
 *   botón, incluso si se reabre la app desde el navegador normal.
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isMobile] = useState(esDispositivoMovil)
  const [isInstalled, setIsInstalled] = useState(() => {
    // Se resuelve una sola vez, en el primer render: si ya se está
    // ejecutando en modo standalone (ícono instalado) o si una sesión
    // anterior ya marcó la app como instalada, arrancamos directamente
    // en "instalado" sin parpadeos ni renders en cascada.
    const yaInstalada = esDisplayStandalone() || leerFlagInstalado()
    if (yaInstalada) guardarFlagInstalado()
    return yaInstalada
  })

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Evita el mini-infobar automático del navegador: el control lo
      // tiene el botón propio de MisFinanzas.
      event.preventDefault()
      setDeferredPrompt(event)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      guardarFlagInstalado()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        // No hace falta esperar "appinstalled": ya sabemos el resultado.
        setIsInstalled(true)
        guardarFlagInstalado()
      }
      // Si el usuario cancela ("dismissed"), no se oculta el botón: se
      // deja disponible para reintentar. El propio evento del navegador
      // ya no se puede reutilizar (limitación del API beforeinstallprompt),
      // pero si el navegador dispara uno nuevo más adelante, este hook
      // lo captura solo y el botón vuelve a funcionar sin recargar nada.
    } catch {
      // Evento ya usado o inválido: no rompe la UI, simplemente el botón
      // queda a la espera de un nuevo `beforeinstallprompt`.
    }
  }, [deferredPrompt])

  const canInstall = isMobile && !isInstalled && deferredPrompt !== null

  return { canInstall, promptInstall, isInstalled }
}
