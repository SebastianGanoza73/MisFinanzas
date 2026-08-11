import { useState, useEffect } from 'react'
import { useCategorias } from '../hooks/useCategorias'
import ConfirmModal from './ConfirmModal'
import CategoriaFormModal from './CategoriaFormModal'

export default function CategoriasModal({ onClose }) {
  const { categorias, addCategoria, updateCategoria, deleteCategoria } = useCategorias()
  const [formAbierto, setFormAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [borrando, setBorrando] = useState(null)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && !formAbierto && !borrando) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, formAbierto, borrando])

  // Antes esto comparaba con un ref al contenido y se rompía apenas
  // había un modal anidado encima (editar categoría, confirmar borrado):
  // cualquier click ahí "burbujeaba" hasta este backdrop y lo cerraba
  // todo de golpe. Comparar target === currentTarget es a prueba de eso:
  // solo cierra si el click fue literalmente sobre el fondo oscuro.
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleGuardar = async (payload) => {
    return editando ? updateCategoria(editando.id, payload) : addCategoria(payload)
  }

  const handleEdit = (cat) => {
    setEditando(cat)
    setFormAbierto(true)
  }

  const handleNueva = () => {
    setEditando(null)
    setFormAbierto(true)
  }

  const confirmarBorrado = async () => {
    await deleteCategoria(borrando.id)
    setBorrando(null)
  }

  const ingresos = categorias.filter((c) => c.tipo === 'ingreso').sort((a, b) => a.nombre.localeCompare(b.nombre))
  const egresos = categorias.filter((c) => c.tipo === 'egreso').sort((a, b) => a.nombre.localeCompare(b.nombre))

  const renderFila = (cat) => (
    <div
      key={cat.id}
      className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/70 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-lg shrink-0 shadow-sm shadow-gray-200/60 dark:shadow-none">
          {cat.icono}
        </span>
        <span className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">{cat.nombre}</span>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => handleEdit(cat)}
          aria-label={`Editar ${cat.nombre}`}
          className="w-11 h-11 flex items-center justify-center rounded-xl text-xl text-gray-500 hover:text-brand-600 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-900/20 transition-all active:scale-90"
        >
          ✏️
        </button>
        <button
          onClick={() => setBorrando(cat)}
          aria-label={`Eliminar ${cat.nombre}`}
          className="w-11 h-11 flex items-center justify-center rounded-xl text-xl text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-all active:scale-90"
        >
          🗑️
        </button>
      </div>
    </div>
  )

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 px-4 animate-fade-in"
      onMouseDown={handleBackdropClick}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-black/10 p-7 max-h-[85vh] overflow-y-auto animate-scale-in"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestionar categorías</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNueva}
              aria-label="Nueva categoría"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xl leading-none transition-all active:scale-90 shadow-sm"
            >
              +
            </button>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300 font-bold text-xl leading-none transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-semibold uppercase text-brand-600 dark:text-brand-400 mb-2.5">Ingresos</p>
            <div className="flex flex-col gap-2">
              {ingresos.length > 0 ? (
                ingresos.map(renderFila)
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">Sin categorías de ingreso</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase text-red-500 dark:text-red-400 mb-2.5">Egresos</p>
            <div className="flex flex-col gap-2">
              {egresos.length > 0 ? (
                egresos.map(renderFila)
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">Sin categorías de egreso</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {formAbierto && (
        <CategoriaFormModal
          categoria={editando}
          onClose={() => setFormAbierto(false)}
          onSave={handleGuardar}
        />
      )}

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
