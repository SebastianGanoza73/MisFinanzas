import { useState } from 'react'
import { useCategorias } from '../hooks/useCategorias'
import { getFechaLocal } from '../lib/formatters'

export default function MovimientoModal({ tipo, movimiento, onClose, onSave }) {
  const { categorias } = useCategorias()
  const esEdicion = Boolean(movimiento)

  const [monto, setMonto] = useState(movimiento?.monto?.toString() ?? '')
  const [categoriaId, setCategoriaId] = useState(movimiento?.categoria_id ?? '')
  const [descripcion, setDescripcion] = useState(movimiento?.descripcion ?? '')
  const [fecha, setFecha] = useState(movimiento?.fecha ?? getFechaLocal())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categoriasFiltradas = categorias.filter((c) => c.tipo === tipo)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await onSave({
      tipo,
      monto: parseFloat(monto),
      categoria_id: categoriaId || null,
      descripcion,
      fecha,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      onClose()
    }
  }

  const esIngreso = tipo === 'ingreso'

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
          {esEdicion ? 'Editar' : 'Nuevo'} {esIngreso ? 'ingreso' : 'egreso'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="number"
            step="0.01"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Selecciona categoría</option>
            {categoriasFiltradas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icono} {c.nombre}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

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
              className={`flex-1 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                esIngreso ? 'bg-brand-600 hover:bg-brand-700' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {loading ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}