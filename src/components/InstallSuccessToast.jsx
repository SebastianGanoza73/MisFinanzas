import { useEffect } from 'react'

// Cuánto tiempo (ms) queda visible el toast antes de desaparecer solo.
const AUTO_DISMISS_MS = 5000

// Toast que confirma la instalación exitosa de la PWA e invita al
// usuario a abrir la app desde el ícono en su pantalla de inicio (no es
// posible, por restricciones del navegador, abrirla automáticamente
// desde código — ver conversación). Se autodesaparece solo, sin
// necesidad de que el usuario lo cierre a mano.
export default function InstallSuccessToast({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className="sm:hidden fixed z-50 left-4 right-4 animate-slide-up"
      style={{ bottom: 'calc(6.5rem + env(safe-area-inset-bottom))' }}
    >
      <div
        role="status"
        className="
          flex items-center gap-3
          bg-brand-600 text-white
          px-4 py-3 rounded-2xl
          shadow-lg shadow-brand-900/30
        "
      >
        <span className="w-8 h-8 shrink-0 rounded-full bg-white/15 flex items-center justify-center text-base leading-none">
          ✅
        </span>
        <p className="text-sm font-medium leading-snug">
          ¡MisFinanzas se instaló! Ábrela desde el ícono en tu pantalla de inicio.
        </p>
      </div>
    </div>
  )
}
