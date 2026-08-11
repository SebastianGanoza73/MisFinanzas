import { useCallback, useEffect, useState } from 'react'
import {
  getDeferredPrompt,
  getIsInstalled,
  markInstalled,
  subscribe,
  marcarJustInstalled,
  consumirJustInstalled,
} from '../lib/pwaInstallService'

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
 * - Lee el evento nativo `beforeinstallprompt` capturado por
 *   lib/pwaInstallService.js (capturado a nivel de módulo, antes de
 *   que React monte nada, para no perderlo por timing con el splash
 *   screen u otros retrasos de montaje).
 * - Expone `promptInstall` para abrir ese diálogo nativo bajo demanda.
 * - Detecta instalación ya sea por el evento `appinstalled` o porque la
 *   app ya se está ejecutando en modo standalone (ícono instalado).
 * - Recuerda la instalación entre sesiones para no volver a mostrar el
 *   botón, incluso si se reabre la app desde el navegador normal.
 * - Recuerda si "se acaba de instalar" en localStorage (no solo en
 *   estado de React), porque el service worker (registerType:
 *   'autoUpdate') puede recargar la página justo en ese instante y
 *   borrar el estado antes de que el toast se muestre.
 */
export function usePwaInstall() {
  const [isMobile] = useState(esDispositivoMovil)

  const [deferredPrompt, setDeferredPrompt] = useState(getDeferredPrompt)
  // Distinto de isInstalled: isInstalled también es true en sesiones
  // futuras (por el flag en localStorage), mientras que justInstalled
  // solo se enciende una vez, en el momento exacto en que el usuario
  // acepta el diálogo nativo (o justo después, si hubo una recarga) —
  // es la señal que usa el toast de éxito para saber cuándo mostrarse.
  const [justInstalled, setJustInstalled] = useState(consumirJustInstalled)
  const [isInstalled, setIsInstalled] = useState(() => {
    // Se resuelve una sola vez, en el primer render: si ya se está
    // ejecutando en modo standalone (ícono instalado), si el servicio
    // ya detectó "appinstalled", o si una sesión anterior ya marcó la
    // app como instalada, arrancamos directamente en "instalado" sin
    // parpadeos ni renders en cascada.
    const yaInstalada = getIsInstalled() || leerFlagInstalado()
    if (yaInstalada) guardarFlagInstalado()
    return yaInstalada
  })

  useEffect(() => {
    // Nos suscribimos a los cambios del servicio compartido. También
    // sincronizamos el estado actual al montar, por si el evento
    // beforeinstallprompt (o appinstalled) ya había llegado antes de
    // que este componente existiera.
    const sincronizar = () => {
      setDeferredPrompt(getDeferredPrompt())
      if (getIsInstalled()) {
        setIsInstalled(true)
        guardarFlagInstalado()
      }
    }

    sincronizar()
    return subscribe(sincronizar)
  }, [])

  const promptInstall = useCallback(async () => {
    const prompt = getDeferredPrompt()
    if (!prompt) return

    try {
      await prompt.prompt()
      const { outcome } = await prompt.userChoice

      if (outcome === 'accepted') {
        // Se guarda ANTES que nada: si el service worker recarga la
        // página justo después de esto, esta marca sobrevive y el
        // toast igual se muestra al volver a montar la app.
        marcarJustInstalled()

        // No hace falta esperar "appinstalled": ya sabemos el resultado.
        setIsInstalled(true)
        setJustInstalled(true)
        guardarFlagInstalado()
        markInstalled()
      }
      // Si el usuario cancela ("dismissed"), no se oculta el botón: se
      // deja disponible para reintentar. El propio evento del navegador
      // ya no se puede reutilizar (limitación del API beforeinstallprompt),
      // pero si el navegador dispara uno nuevo más adelante, el servicio
      // lo captura solo y el botón vuelve a funcionar sin recargar nada.
    } catch {
      // Evento ya usado o inválido: no rompe la UI, simplemente el botón
      // queda a la espera de un nuevo `beforeinstallprompt`.
    }
  }, [])

  const canInstall = isMobile && !isInstalled && deferredPrompt !== null

  // El toast lo llama cuando termina de mostrarse, para no dispararlo
  // de nuevo en renders posteriores dentro de la misma sesión.
  const dismissJustInstalled = useCallback(() => setJustInstalled(false), [])

  return { canInstall, promptInstall, isInstalled, justInstalled, dismissJustInstalled }
}
