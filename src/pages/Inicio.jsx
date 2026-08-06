import { useState, useMemo } from 'react'
import { useMovimientos } from '../hooks/useMovimientos'
import MovimientoModal from '../components/MovimientoModal'
import MovimientoAcciones from '../components/MovimientoAcciones'
import ConfirmModal from '../components/ConfirmModal'
import { formatFecha, formatMoney } from '../lib/formatters'

export default function Inicio() {
  const { movimientos, loading, addMovimiento, updateMovimiento, deleteMovimiento } = useMovimientos()
  const [modalTipo, setModalTipo] = useState(null)
  const [seleccionado, setSeleccionado] = useState(null)
  const [editando, setEditando] = useState(null)
  const [borrando, setBorrando] = useState(null)

  const { balance, ingresosMes, egresosMes } = useMemo(() => {
    const now = new Date()
    const mesActual = now.getMonth()
    const anioActual = now.getFullYear()

    let ingresosMes = 0
    let egresosMes = 0
    let balance = 0

    movimientos.forEach((m) => {
      const fecha = new Date(m.fecha)
      const esDelMes = fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual

      if (m.tipo === 'ingreso') {
        balance += Number(m.monto)
        if (esDelMes) ingresosMes += Number(m.monto)
      } else {
        balance -= Number(m.monto)
        if (esDelMes) egresosMes += Number(m.monto)
      }
    })

    return { balance, ingresosMes, egresosMes }
  }, [movimientos])

  const ahorroEstimado = ingresosMes - egresosMes

  const confirmarBorrado = async () => {
    await deleteMovimiento(borrando.id)
    setBorrando(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-8 relative">
        <p className="hidden sm:block absolute top-8 right-8 text-sm font-medium text-brand-100 capitalize">
          {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <p className="text-xs uppercase tracking-wide text-brand-100 mb-2">
          Tu balance
        </p>
        <p className="text-4xl font-bold mb-1">{formatMoney(balance)}</p>
        <p className="text-sm text-brand-100 mb-6">
          Tu balance del mes en curso, actualizado en tiempo real.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs uppercase text-brand-100 mb-1">Ingresos del mes</p>
            <p className="text-lg font-bold">{formatMoney(ingresosMes)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs uppercase text-brand-100 mb-1">Egresos del mes</p>
            <p className="text-lg font-bold">{formatMoney(egresosMes)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs uppercase text-brand-100 mb-1">Ahorro estimado</p>
            <p className="text-lg font-bold">{formatMoney(ahorroEstimado)}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setModalTipo('ingreso')}
            className="bg-white text-brand-700 font-medium px-4 py-2 rounded-lg hover:bg-brand-50 transition-colors"
          >
            + Nuevo ingreso
          </button>
          <button
            onClick={() => setModalTipo('egreso')}
            className="bg-red-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            − Nuevo egreso
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
          Últimos movimientos
        </h2>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando...</p>
        ) : movimientos.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Aún no tienes movimientos registrados.
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
            {movimientos.slice(0, 10).map((m) => (
              <button
                key={m.id}
                onClick={() => setSeleccionado(m)}
                className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 hover:border-brand-400 dark:hover:border-brand-600 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{m.categorias?.icono ?? '💰'}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {m.categorias?.nombre ?? 'Sin categoría'}
                    </p>
                    {m.descripcion && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {m.descripcion}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <p
                    className={`text-sm font-semibold ${
                      m.tipo === 'ingreso' ? 'text-brand-600 dark:text-brand-400' : 'text-red-500'
                    }`}
                  >
                    {m.tipo === 'ingreso' ? '+' : '−'} {formatMoney(Number(m.monto))}
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatFecha(m.fecha)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {modalTipo && (
        <MovimientoModal
          tipo={modalTipo}
          onClose={() => setModalTipo(null)}
          onSave={addMovimiento}
        />
      )}

      {seleccionado && (
        <MovimientoAcciones
          movimiento={seleccionado}
          onClose={() => setSeleccionado(null)}
          onEdit={() => {
            setEditando(seleccionado)
            setSeleccionado(null)
          }}
          onDelete={() => {
            setBorrando(seleccionado)
            setSeleccionado(null)
          }}
        />
      )}

      {editando && (
        <MovimientoModal
          tipo={editando.tipo}
          movimiento={editando}
          onClose={() => setEditando(null)}
          onSave={(cambios) => updateMovimiento(editando.id, cambios)}
        />
      )}

      {borrando && (
        <ConfirmModal
          title="Eliminar movimiento"
          message={`¿Seguro que quieres eliminar "${borrando.categorias?.nombre ?? 'este movimiento'}" por ${formatMoney(borrando.monto)}?`}
          onConfirm={confirmarBorrado}
          onCancel={() => setBorrando(null)}
        />
      )}
    </div>
  )
}