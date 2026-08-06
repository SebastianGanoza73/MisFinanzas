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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
          {esEdicion ? 'Editar meta' : 'Nueva meta'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre de la meta (ej. Viaje a Cusco)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <input
            type="number"
            step="0.01"
            placeholder="Monto objetivo"
            value={montoObjetivo}
            onChange={(e) => setMontoObjetivo(e.target.value)}
            required
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="alta">Prioridad alta</option>
            <option value="media">Prioridad media</option>
            <option value="baja">Prioridad baja</option>
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}