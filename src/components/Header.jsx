import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'
import CategoriasModal from './CategoriasModal'
import { useMode } from '../context/ModeContext'

export default function Header() {
  const [showCategorias, setShowCategorias] = useState(false)
  const { toggleMode } = useMode()

  return (
    <header
      className="
        relative
        flex items-center justify-between gap-3
        bg-white dark:bg-gray-900
        shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]
        px-4 sm:px-6 py-5
      "
    >
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Mi balance
        </h1>
      </div>

      {/* Orden fijo en ambos modos (Estándar y Express): categorías, tema,
          cambio de modo. Así no cambia el orden al alternar entre modos. */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        <button
          onClick={() => setShowCategorias(true)}
          className="
            flex items-center gap-1.5
            text-sm font-semibold
            text-gray-700 dark:text-gray-200
            bg-white hover:bg-gray-50 border border-gray-200 shadow-sm shadow-gray-200/40 dark:border-transparent dark:shadow-none
            dark:bg-gray-800 dark:hover:bg-gray-700
            px-3 sm:px-3.5 py-2.5 rounded-xl
            transition-all active:scale-95
          "
        >
          🏷️
          <span className="hidden sm:inline">Categorías</span>
        </button>

        <ThemeToggle />

        <button
          onClick={toggleMode}
          className="
            flex items-center gap-1.5
            text-sm font-semibold
            px-3 sm:px-3.5 py-2.5 rounded-xl
            bg-brand-50 hover:bg-brand-100 border border-brand-100 dark:border-transparent
            dark:bg-brand-900/25 dark:hover:bg-brand-900/40
            text-brand-700 dark:text-brand-400
            transition-all active:scale-95
          "
        >
          <span>⚡</span>
          <span className="hidden sm:inline">Modo Express</span>
        </button>

        <UserMenu />

      </div>

      {showCategorias && (
        <CategoriasModal onClose={() => setShowCategorias(false)} />
      )}
    </header>
  )
}
