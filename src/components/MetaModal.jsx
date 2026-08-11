import { useState } from 'react'

export default function MetaModal({ meta, onClose, onSave }) {
  const esEdicion = Boolean(meta)
  const [nombre, setNombre] = useState(meta?.nombre ?? '')
  const [montoObjetivo, setMontoObjetivo] = useState(meta?.monto_objetivo?.toString() ?? '')
  const [prioridad, setPrioridad] = useState(meta?.prioridad ?? 'media')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await onSave({
      nombre,
      monto_objetivo: parseFloat(montoObjetivo),
      prioridad,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-black/10 p-7 sm:p-8 animate-scale-in">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          {esEdicion ? 'Editar meta' : 'Nueva meta'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Nombre</span>
            <input
              type="text"
              placeholder="Ej. Viaje a Cusco"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              autoFocus
              className="px-4 py-3.5 rounded-xl text-base border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Monto objetivo</span>
            <input
              type="number"
              step="0.01"
              placeholder="S/ 0.00"
              value={montoObjetivo}
              onChange={(e) => setMontoObjetivo(e.target.value)}
              required
              className="px-4 py-3.5 rounded-xl text-lg font-semibold border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Prioridad</span>
            <select
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
              className="px-4 py-3.5 rounded-xl text-base font-medium border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
            >
              <option value="alta">Prioridad alta</option>
              <option value="media">Prioridad media</option>
              <option value="baja">Prioridad baja</option>
            </select>
          </label>

          {error && <p className="text-red-500 dark:text-red-400 text-sm font-semibold">{error}</p>}

          <div className="flex gap-2.5 mt-2">
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
              {loading ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
