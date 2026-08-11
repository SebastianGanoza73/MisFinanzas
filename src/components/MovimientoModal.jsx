import { useState } from 'react'
import { useCategorias } from '../hooks/useCategorias'
import { getFechaLocal } from '../lib/formatters'

export default function MovimientoModal({ tipo, movimiento, fechaInicial, ocultarFecha, onClose, onSave }) {  
  const { categorias } = useCategorias()
  const esEdicion = Boolean(movimiento)

  const [monto, setMonto] = useState(movimiento?.monto?.toString() ?? '')
  const [categoriaId, setCategoriaId] = useState(movimiento?.categoria_id ?? '')
  const [descripcion, setDescripcion] = useState(movimiento?.descripcion ?? '')
  const [fecha, setFecha] = useState(
    movimiento?.fecha ?? fechaInicial ?? getFechaLocal()
  )
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-black/10 p-7 sm:p-8 animate-scale-in">
        <div className="flex items-center gap-3 mb-6">
          <span className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${
            esIngreso ? 'bg-brand-100 dark:bg-brand-900/40' : 'bg-red-100 dark:bg-red-900/40'
          }`}>
            {esIngreso ? '➕' : '➖'}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {esEdicion ? 'Editar' : 'Nuevo'} {esIngreso ? 'ingreso' : 'egreso'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Monto</span>
            <input
              type="number"
              step="0.01"
              placeholder="S/ 0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
              autoFocus
              className="px-4 py-3.5 rounded-xl text-xl font-semibold border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Categoría</span>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              required
              className="px-4 py-3.5 rounded-xl text-base font-medium border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
            >
              <option value="">Selecciona categoría</option>
              {categoriasFiltradas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icono} {c.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Descripción (opcional)</span>
            <input
              type="text"
              placeholder="Ej. Almuerzo con amigos"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="px-4 py-3.5 rounded-xl text-base font-medium border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
            />
          </label>

          {!ocultarFecha && (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Fecha</span>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                className="px-4 py-3.5 rounded-xl text-base font-medium border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
              />
            </label>
          )}

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
              className={`flex-1 py-3.5 rounded-xl text-base font-semibold text-white transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-sm ${
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
