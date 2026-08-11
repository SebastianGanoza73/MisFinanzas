import { usePwaInstall } from '../hooks/usePwaInstall'

// Botón flotante, solo mobile, para instalar MisFinanzas como PWA.
// No se renderiza nada (ni siquiera un contenedor vacío) salvo que se
// cumplan TODAS las condiciones: dispositivo móvil, el navegador ya
// ofreció el evento beforeinstallprompt, y la app todavía no está
// instalada. Así nunca aparece un botón "roto" ni en desktop.
export default function InstallPwaButton() {
  const { canInstall, promptInstall } = usePwaInstall()

  if (!canInstall) return null

  return (
    <div
      className="sm:hidden fixed z-50 right-4 animate-slide-up"
      style={{ bottom: 'calc(6.5rem + env(safe-area-inset-bottom))' }}
    >
      <button
        onClick={promptInstall}
        aria-label="Instalar MisFinanzas como aplicación"
        className="
          flex items-center gap-2
          text-sm font-bold text-white
          bg-brand-600 hover:bg-brand-700
          pl-3 pr-4 py-3 rounded-full
          shadow-lg shadow-brand-900/30
          transition-all active:scale-95
        "
      >
        <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-base leading-none">
          📲
        </span>
        Instalar aplicación
      </button>
    </div>
  )
}
