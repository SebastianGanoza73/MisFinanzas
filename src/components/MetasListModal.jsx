import MetaCard from './MetaCard'

// Modal centrado (mismo patrón que MovimientoModal/MetaModal) con todas las
// metas en una lista deslizable interna: así, aunque haya 10 metas, la
// página de Metas de ahorro no se alarga — solo se desliza dentro del modal.
export default function MetasListModal({ metas, onClose, onEditar, onEliminar }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 px-4 animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-black/10 p-6 sm:p-7 max-h-[85vh] flex flex-col animate-scale-in">
        <div className="flex items-center justify-between mb-5 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Mis metas de ahorro ({metas.length})
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300 font-bold text-lg leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pr-1 -mr-1">
          {metas.map((m) => (
            <MetaCard
              key={m.id}
              meta={m}
              compact
              onEditar={() => onEditar(m)}
              onEliminar={() => onEliminar(m)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

