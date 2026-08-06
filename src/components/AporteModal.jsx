import { useState } from 'react'
import { formatMoney } from '../lib/formatters'

export default function AporteModal({ meta, onClose, onSave }) {
  const [monto, setMonto] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await onSave(parseFloat(monto))

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
        <h2 className="text-lg font-bold mb-1 text-gray-900 dark:text-gray-100">Aportar a "{meta.nombre}"</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Llevas {formatMoney(meta.monto_actual)} de {formatMoney(meta.monto_objetivo)}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="number"
            step="0.01"
            placeholder="Monto a aportar"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
            autoFocus
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
              className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Aportar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}