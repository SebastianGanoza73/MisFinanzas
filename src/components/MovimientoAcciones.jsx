import { formatFecha, formatMoney } from '../lib/formatters'

export default function MovimientoAcciones({ movimiento, onClose, onEdit, onDelete }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 px-4 animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-black/10 p-7 sm:p-8 animate-scale-in">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{movimiento.categorias?.icono ?? '💰'}</span>
          <div>
            <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {movimiento.categorias?.nombre ?? 'Sin categoría'}
            </p>
            <p className="text-base text-gray-500 dark:text-gray-400">
              {formatFecha(movimiento.fecha)}
            </p>
          </div>
        </div>

        <p
          className={`text-4xl font-extrabold mb-1 ${
            movimiento.tipo === 'ingreso' ? 'text-brand-600 dark:text-brand-400' : 'text-loss-600 dark:text-loss-400'
          }`}
        >
          {movimiento.tipo === 'ingreso' ? '+' : '−'} {formatMoney(movimiento.monto)}
        </p>
        {movimiento.descripcion && (
          <p className="text-base text-gray-500 dark:text-gray-400 mb-6">{movimiento.descripcion}</p>
        )}

        <div className="flex flex-col gap-2.5 mt-5">
          <button
            onClick={onEdit}
            className="w-full py-3.5 rounded-xl text-base font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors active:scale-[0.98]"
          >
            ✏️ Editar
          </button>
          <button
            onClick={onDelete}
            className="w-full py-3.5 rounded-xl text-base font-semibold bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors active:scale-[0.98]"
          >
            🗑️ Eliminar
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl text-base font-semibold text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors active:scale-[0.98]"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
