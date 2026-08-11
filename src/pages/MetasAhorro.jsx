import { useState } from 'react'
import { useMetas } from '../hooks/useMetas'
import MetaModal from '../components/MetaModal'
import ConfirmModal from '../components/ConfirmModal'
import MetaCard from '../components/MetaCard'
import MetaCarousel from '../components/MetaCarousel'

export default function MetasAhorro() {
  const { metas, loading, addMeta, updateMeta, deleteMeta } = useMetas()
  const [creando, setCreando] = useState(false)
  const [editando, setEditando] = useState(null)
  const [borrando, setBorrando] = useState(null)

  const confirmarBorrado = async () => {
    await deleteMeta(borrando.id)
    setBorrando(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-6 sm:p-8 shadow-lg shadow-brand-900/15">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-100 mb-2">Metas de ahorro</p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 tracking-tight">Alcanza tus metas, un aporte a la vez</h1>
        <p className="text-sm text-brand-100 mb-4">
          El progreso se actualiza solo con tus ingresos y egresos registrados: no necesitas aportar manualmente.
        </p>
        <button
          onClick={() => setCreando(true)}
          className="bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-50 active:scale-95 transition-all shadow-sm"
        >
          + Nueva meta
        </button>
      </div>

      {/* El slider que antes vivía en Inicio ahora está solo aquí, en su
          propia página, visible en mobile. */}
      {!loading && metas.length > 0 && (
        <div className="sm:hidden">
          <MetaCarousel metas={metas} />
        </div>
      )}

      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
          Mis metas de ahorro
        </p>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando...</p>
        ) : metas.length === 0 ? (
          <div className="text-center py-14 bg-white dark:bg-gray-900 shadow-sm shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-2xl">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Aún no tienes metas de ahorro
            </p>
            <button
              onClick={() => setCreando(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl active:scale-95 transition-all shadow-sm"
            >
              + Crear mi primera meta
            </button>
          </div>
        ) : (
          <div className="hidden sm:grid sm:grid-cols-2 gap-4">
            {metas.map((m) => (
              <MetaCard
                key={m.id}
                meta={m}
                onEditar={() => setEditando(m)}
                onEliminar={() => setBorrando(m)}
              />
            ))}
          </div>
        )}

        {/* En mobile, la lista completa debajo del slider (editar/eliminar). */}
        {!loading && metas.length > 0 && (
          <div className="sm:hidden flex flex-col gap-3 mt-4">
            {metas.map((m) => (
              <MetaCard
                key={m.id}
                meta={m}
                compact
                onEditar={() => setEditando(m)}
                onEliminar={() => setBorrando(m)}
              />
            ))}
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
