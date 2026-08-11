import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/historial', label: 'Historial' },
  { to: '/resumen-semanal', label: 'Resumen semanal' },
  { to: '/balance-mensual', label: 'Balance mensual' },
  { to: '/metas-ahorro', label: 'Metas de ahorro' },
  { to: '/exportar', label: 'Exportar a Excel' },
]

// Solo desktop: en mobile la navegación vive en BottomNav (barra fija
// inferior), ya no hay drawer de hamburguesa que se despliega.
export default function Sidebar() {
  return (
    <aside
      className="
        hidden sm:block sm:static top-0 left-0 h-screen sm:min-h-screen w-64 shrink-0
        bg-white dark:bg-gray-900 p-5
        shadow-[1px_0_0_0_rgba(0,0,0,0.06)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.06)]
      "
    >
      <div className="flex items-center gap-2.5 mb-8 px-2">
        <span className="text-brand-600 dark:text-brand-400 text-2xl">📈</span>
        <span className="font-bold text-lg text-gray-900 dark:text-gray-100 tracking-tight">MisFinanzas</span>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `relative px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/60'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
