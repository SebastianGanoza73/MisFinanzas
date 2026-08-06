import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      className="
        flex items-center gap-1.5
        text-sm font-medium
        text-gray-700 dark:text-gray-200
        bg-gray-100 hover:bg-gray-200
        dark:bg-gray-800 dark:hover:bg-gray-700
        px-2.5 sm:px-3
        py-2
        rounded-lg
        transition-colors
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-brand-500
      "
    >
      <span>
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>

      <span className="hidden sm:inline">
        Tema
      </span>
    </button>
  )
}
