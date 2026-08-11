import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const { user, signOut } = useAuth()

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initial = user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-9 h-9 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center justify-center transition-colors"
        aria-label="Menú de usuario"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Sesión iniciada como</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.email}
            </p>
          </div>
          <button
            onClick={signOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
