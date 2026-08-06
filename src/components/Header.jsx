import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'
import CategoriasModal from './CategoriasModal'

export default function Header({ onMenuClick }) {
  const [showCategorias, setShowCategorias] = useState(false)

  return (
    <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 sm:px-6 py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Abrir menú"
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          ☰
        </button>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Mi balance</h1>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setShowCategorias(true)}
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
        >
          🏷️ Categorías
        </button>
        <input
          type="text"
          placeholder="Buscar movimiento..."
          className="hidden sm:block px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <ThemeToggle />
        <UserMenu />
      </div>

      {showCategorias && <CategoriasModal onClose={() => setShowCategorias(false)} />}
    </header>
  )
}