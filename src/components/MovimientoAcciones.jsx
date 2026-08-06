import { formatFecha, formatMoney } from '../lib/formatters'

export default function MovimientoAcciones({ movimiento, onClose, onEdit, onDelete }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{movimiento.categorias?.icono ?? '💰'}</span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {movimiento.categorias?.nombre ?? 'Sin categoría'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatFecha(movimiento.fecha)}
            </p>
          </div>
        </div>

        <p
          className={`text-2xl font-bold mb-1 ${
            movimiento.tipo === 'ingreso' ? 'text-brand-600 dark:text-brand-400' : 'text-red-500'
          }`}
        >
          {movimiento.tipo === 'ingreso' ? '+' : '−'} {formatMoney(movimiento.monto)}
        </p>
        {movimiento.descripcion && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{movimiento.descripcion}</p>
        )}

        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={onEdit}
            className="w-full py-2.5 rounded-lg text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white transition-colors"
          >
            ✏️ Editar
          </button>
          <button
            onClick={onDelete}
            className="w-full py-2.5 rounded-lg text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors"
          >
            🗑️ Eliminar
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}