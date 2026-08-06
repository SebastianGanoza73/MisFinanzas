import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/historial', label: 'Historial' },
  { to: '/resumen-semanal', label: 'Resumen semanal' },
  { to: '/balance-mensual', label: 'Balance mensual' },
  { to: '/metas-ahorro', label: 'Metas de ahorro' },
  { to: '/exportar', label: 'Exportar a Excel' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay oscuro detrás del drawer en móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen lg:h-auto lg:min-h-screen
          w-64 shrink-0 border-r border-gray-200 dark:border-gray-800
          bg-white dark:bg-gray-900 p-6 z-50
          transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-brand-600 dark:text-brand-400 text-xl">📈</span>
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">MisFinanzas</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}