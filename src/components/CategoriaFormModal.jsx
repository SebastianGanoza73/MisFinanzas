import { useState, useEffect } from 'react'

const ICONOS_SUGERIDOS = ['💰', '🍔', '🚌', '🏠', '🎮', '🛒', '💊', '🎓', '✈️', '🎯', '📱', '🐾']

export default function CategoriaFormModal({ categoria, onClose, onSave }) {
  const [nombre, setNombre] = useState(categoria?.nombre ?? '')
  const [tipo, setTipo] = useState(categoria?.tipo ?? 'egreso')
  const [icono, setIcono] = useState(categoria?.icono ?? '💰')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const esEdicion = Boolean(categoria)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Mismo arreglo que en CategoriasModal: cerrar solo si el click fue
  // directamente sobre el fondo, no si "burbujeó" desde algo de adentro.
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await onSave({ nombre, tipo, icono })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[60] px-4 animate-fade-in"
      onMouseDown={handleBackdropClick}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-black/10 p-7 sm:p-8 animate-scale-in"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {esEdicion ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-10 h-10 flex items-center justify-center rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 font-bold text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">
              Ícono
            </label>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-3xl shrink-0">
                {icono}
              </span>
              <input
                type="text"
                value={icono}
                onChange={(e) => setIcono(e.target.value)}
                maxLength={2}
                className="w-16 h-16 px-2 py-2 text-center rounded-xl text-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <div className="flex flex-wrap gap-2 flex-1">
                {ICONOS_SUGERIDOS.map((i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setIcono(i)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all active:scale-90 ${
                      icono === i
                        ? 'bg-brand-100 dark:bg-brand-900/40 ring-2 ring-brand-500'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Nombre de la categoría"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl text-base border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setTipo('ingreso')}
                className={`py-3.5 rounded-xl text-base font-semibold transition-all active:scale-95 ${
                  tipo === 'ingreso'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Ingreso
              </button>
              <button
                type="button"
                onClick={() => setTipo('egreso')}
                className={`py-3.5 rounded-xl text-base font-semibold transition-all active:scale-95 ${
                  tipo === 'egreso'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Egreso
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 dark:text-red-400 text-sm font-semibold">{error}</p>}

          <div className="flex gap-2.5 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl text-base font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 rounded-xl text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 shadow-sm"
            >
              {loading ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Agregar categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
