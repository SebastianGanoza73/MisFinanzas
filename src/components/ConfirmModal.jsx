export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[60] px-4 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-black/10 p-7 sm:p-8 animate-scale-in">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{title}</h2>
        <p className="text-base text-gray-600 dark:text-gray-400 mb-7">{message}</p>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-xl text-base font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 rounded-xl text-base font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all shadow-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
