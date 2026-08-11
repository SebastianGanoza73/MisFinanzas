import { NavLink } from 'react-router-dom'

// Inicio va al centro y más grande: es la pantalla desde la que nace todo
// lo demás, así que el orden y el tamaño lo dejan claro de un vistazo.
const links = [
  { to: '/resumen-semanal', label: 'Resumen', icono: '📆' },
  { to: '/metas-ahorro', label: 'Metas', icono: '🎯' },
  { to: '/', label: 'Inicio', icono: '🏠', end: true, principal: true },
  { to: '/historial', label: 'Historial', icono: '🧾' },
  { to: '/balance-mensual', label: 'Balance', icono: '📊' },
]

// Reemplaza el menú de hamburguesa: navegación siempre visible y fija
// abajo, solo en mobile (en desktop el Sidebar ya cumple ese rol).
export default function BottomNav() {
  return (
    <nav
      className="
        sm:hidden fixed bottom-0 left-0 right-0 z-40
        bg-white/95 dark:bg-gray-900/95 backdrop-blur-md
        border-t border-gray-100 dark:border-gray-800
        pb-[env(safe-area-inset-bottom)]
        flex items-end justify-around
      "
    >
      {links.map((link) =>
        link.principal ? (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className="flex-1 flex flex-col items-center justify-center -translate-y-3"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl leading-none shadow-lg transition-all active:scale-90 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-brand-900/30 scale-105'
                      : 'bg-brand-500 text-white shadow-brand-900/20'
                  }`}
                >
                  {link.icono}
                </span>
                <span
                  className={`mt-1 text-[11px] font-bold ${
                    isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {link.label}
                </span>
              </>
            )}
          </NavLink>
        ) : (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-semibold transition-all active:scale-90 ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-lg leading-none transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {link.icono}
                </span>
                {link.label}
              </>
            )}
          </NavLink>
        )
      )}
    </nav>
  )
}
