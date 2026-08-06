import { useState, useEffect, useRef } from 'react'
import { useCategorias } from '../hooks/useCategorias'
import ConfirmModal from './ConfirmModal'

export default function CategoriasModal({ onClose }) {
  const { categorias, addCategoria, updateCategoria, deleteCategoria } = useCategorias()
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('egreso')
  const [icono, setIcono] = useState('💰')
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [borrando, setBorrando] = useState(null)
  const modalRef = useRef(null)

  // Cerrar con Esc
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Cerrar al hacer clic fuera del contenido del modal
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  const resetForm = () => {
    setNombre('')
    setTipo('egreso')
    setIcono('💰')
    setEditId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const payload = { nombre, tipo, icono }
    const { error } = editId
      ? await updateCategoria(editId, payload)
      : await addCategoria(payload)

    if (error) {
      setError(error.message)
    } else {
      resetForm()
    }
  }

  const handleEdit = (cat) => {
    setEditId(cat.id)
    setNombre(cat.nombre)
    setTipo(cat.tipo)
    setIcono(cat.icono ?? '💰')
  }

  const handleDelete = (cat) => {
    setBorrando(cat)
  }

  const confirmarBorrado = async () => {
    await deleteCategoria(borrando.id)
    setBorrando(null)
  }

  const ingresos = categorias
    .filter((c) => c.tipo === 'ingreso')
    .sort((a, b) => a.nombre.localeCompare(b.nombre))

  const egresos = categorias
    .filter((c) => c.tipo === 'egreso')
    .sort((a, b) => a.nombre.localeCompare(b.nombre))

  const renderFila = (cat) => (
    <div
      key={cat.id}
      className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-lg shrink-0">{cat.icono}</span>
        <span className="text-sm text-gray-900 dark:text-gray-100 truncate">{cat.nombre}</span>
      </div>
      <div className="flex gap-3 shrink-0">
        <button
          onClick={() => handleEdit(cat)}
          className="text-xs text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
        >
          Editar
        </button>
        <button
          onClick={() => handleDelete(cat)}
          className="text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
        >
          Eliminar
        </button>
      </div>
    </div>
  )

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Gestionar categorías</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 flex items-center justify-center rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 font-bold text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6 border-b border-gray-100 dark:border-gray-800 pb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {editId ? 'Editar categoría' : 'Nueva categoría'}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="😀"
              value={icono}
              onChange={(e) => setIcono(e.target.value)}
              maxLength={2}
              className="w-14 px-2 py-2 text-center rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              type="text"
              placeholder="Nombre de la categoría"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="egreso">Egreso</option>
            <option value="ingreso">Ingreso</option>
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              {editId ? 'Guardar cambios' : 'Agregar categoría'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold uppercase text-brand-600 dark:text-brand-400 mb-2">
              Ingresos
            </p>
            <div className="flex flex-col gap-2">
              {ingresos.length > 0 ? (
                ingresos.map(renderFila)
              ) : (
                <p className="text-xs text-gray-400 dark:text-gray-500">Sin categorías de ingreso</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-red-500 dark:text-red-400 mb-2">
              Egresos
            </p>
            <div className="flex flex-col gap-2">
              {egresos.length > 0 ? (
                egresos.map(renderFila)
              ) : (
                <p className="text-xs text-gray-400 dark:text-gray-500">Sin categorías de egreso</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {borrando && (
        <ConfirmModal
          title="Eliminar categoría"
          message={`¿Eliminar "${borrando.nombre}"? Los movimientos que la usan quedarán sin categoría.`}
          onConfirm={confirmarBorrado}
          onCancel={() => setBorrando(null)}
        />
      )}
    </div>
  )
}
