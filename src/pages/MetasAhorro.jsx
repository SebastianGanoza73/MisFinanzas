import { useState } from 'react'
import { useMetas } from '../hooks/useMetas'
import { formatMoney } from '../lib/formatters'
import MetaModal from '../components/MetaModal'
import AporteModal from '../components/AporteModal'
import ConfirmModal from '../components/ConfirmModal'

const prioridadColor = {
  alta: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  media: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  baja: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export default function MetasAhorro() {
  const { metas, loading, addMeta, updateMeta, deleteMeta, aportarAMeta } = useMetas()
  const [creando, setCreando] = useState(false)
  const [editando, setEditando] = useState(null)
  const [aportando, setAportando] = useState(null)
  const [borrando, setBorrando] = useState(null)

  const confirmarBorrado = async () => {
    await deleteMeta(borrando.id)
    setBorrando(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-8">
        <p className="text-xs uppercase tracking-wide text-brand-100 mb-2">Metas de ahorro</p>
        <h1 className="text-2xl font-bold mb-1">Alcanza tus metas, un aporte a la vez</h1>
        <p className="text-sm text-brand-100 mb-4">
          Crea, edita y sigue el progreso de tus ahorros en un solo lugar.
        </p>
        <button
          onClick={() => setCreando(true)}
          className="bg-white text-brand-700 font-medium px-4 py-2 rounded-lg hover:bg-brand-50 transition-colors"
        >
          + Nueva meta
        </button>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
          Mis metas de ahorro
        </p>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando...</p>
        ) : metas.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Aún no tienes metas de ahorro
            </p>
            <button
              onClick={() => setCreando(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Crear mi primera meta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metas.map((m) => {
              const progreso = Math.min(
                100,
                (Number(m.monto_actual) / Number(m.monto_objetivo)) * 100
              )
              const completada = progreso >= 100

              return (
                <div
                  key={m.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{m.nombre}</h3>
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${prioridadColor[m.prioridad]}`}
                      >
                        Prioridad {m.prioridad}
                      </span>
                    </div>
                    {completada && (
                      <span className="text-xs bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400 px-2 py-1 rounded-full font-medium">
                        ✓ Completada
                      </span>
                    )}
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatMoney(m.monto_actual)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        de {formatMoney(m.monto_objetivo)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 rounded-full transition-all"
                        style={{ width: `${progreso}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {progreso.toFixed(0)}% completado
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setAportando(m)}
                      className="flex-1 text-xs font-medium bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-900/20 dark:hover:bg-brand-900/30 dark:text-brand-400 py-2 rounded-lg transition-colors"
                    >
                      + Aportar
                    </button>
                    <button
                      onClick={() => setEditando(m)}
                      className="flex-1 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 py-2 rounded-lg transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setBorrando(m)}
                      className="flex-1 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 py-2 rounded-lg transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {creando && (
        <MetaModal onClose={() => setCreando(false)} onSave={addMeta} />
      )}

      {editando && (
        <MetaModal
          meta={editando}
          onClose={() => setEditando(null)}
          onSave={(cambios) => updateMeta(editando.id, cambios)}
        />
      )}

      {aportando && (
        <AporteModal
          meta={aportando}
          onClose={() => setAportando(null)}
          onSave={(monto) => aportarAMeta(aportando.id, monto)}
        />
      )}

      {borrando && (
        <ConfirmModal
          title="Eliminar meta"
          message={`¿Seguro que quieres eliminar la meta "${borrando.nombre}"?`}
          onConfirm={confirmarBorrado}
          onCancel={() => setBorrando(null)}
        />
      )}
    </div>
  )
}