import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'
import CategoriasModal from './CategoriasModal'
import { useMode } from '../context/ModeContext'

export default function Header({ onMenuClick }) {
  const [showCategorias, setShowCategorias] = useState(false)
  const { toggleMode } = useMode()

  return (
    <header className="flex items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 sm:px-6 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="sm:hidden text-gray-600 dark:text-gray-300 text-2xl leading-none shrink-0"
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
            {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Mi balance</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => setShowCategorias(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-2.5 sm:px-3 py-2 rounded-lg transition-colors"
        >
          🏷️ <span className="hidden sm:inline">Categorías</span>
        </button>
        <input
          type="text"
          placeholder="Buscar..."
          className="hidden md:block px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
  onClick={toggleMode}
  className="hidden sm:block text-sm font-medium px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
>
  Modo lite
</button>
        <ThemeToggle />
        <UserMenu />
      </div>

      {showCategorias && <CategoriasModal onClose={() => setShowCategorias(false)} />}
    </header>
  )
}
