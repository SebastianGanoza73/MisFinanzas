import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useMovimientos } from '../hooks/useMovimientos'
import MovimientoModal from '../components/MovimientoModal'
import MovimientoAcciones from '../components/MovimientoAcciones'
import ConfirmModal from '../components/ConfirmModal'
import { formatFecha, formatMoney } from '../lib/formatters'

const accesos = [
  { to: '/historial', label: 'Historial', icono: '🧾' },
  { to: '/resumen-semanal', label: 'Resumen semanal', icono: '📆' },
  { to: '/balance-mensual', label: 'Balance mensual', icono: '📊' },
  { to: '/exportar', label: 'Exportar a Excel', icono: '📤' },
]

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
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-6 sm:p-8 shadow-lg shadow-brand-900/15 relative">
        {/* Antes solo se veía en desktop (hidden sm:block); en mobile la
            fecha no se mostraba. Ahora se ve siempre. */}
        <p className="absolute top-6 sm:top-8 right-6 sm:right-8 text-xs sm:text-sm font-semibold text-brand-100 capitalize text-right max-w-[45%] sm:max-w-none">
          {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-100 mb-2">
          Tu balance
        </p>
        <p className="text-4xl sm:text-5xl font-bold mb-1 tracking-tight">{formatMoney(balance)}</p>
        <p className="text-sm text-brand-100 mb-6">
          Tu balance del mes en curso, actualizado en tiempo real.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white/15 rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-50 mb-1.5">Ingresos del mes</p>
            <p className="text-xl font-bold text-white">{formatMoney(ingresosMes)}</p>
          </div>
          <div className="bg-white/15 rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-50 mb-1.5">Egresos del mes</p>
            <p className="text-xl font-bold text-white">{formatMoney(egresosMes)}</p>
          </div>
          <div className="bg-white/15 rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-50 mb-1.5">Ahorro estimado</p>
            <p className="text-xl font-bold text-white">{formatMoney(ahorroEstimado)}</p>
          </div>
        </div>

        {/* Botones siempre dentro de la tarjeta (mobile y desktop), para que
            nunca queden tapados ni floten sueltos sobre el contenido cuando
            hay movimientos y la página crece. */}
        <div className="flex gap-3">
          <button
            onClick={() => setModalTipo('ingreso')}
            className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 bg-income-500 hover:bg-income-600 text-white font-semibold px-5 py-3 sm:py-2.5 rounded-xl active:scale-95 transition-all shadow-sm"
          >
            <span className="w-5 h-5 rounded-full bg-brand-400 text-white flex items-center justify-center text-sm leading-none">+</span>
            Nuevo ingreso
          </button>
          <button
            onClick={() => setModalTipo('egreso')}
            className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 bg-loss-500 hover:bg-loss-600 text-white font-semibold px-5 py-3 sm:py-2.5 rounded-xl active:scale-95 transition-all shadow-sm"
          >
            <span className="w-5 h-5 rounded-full bg-white/25 text-white flex items-center justify-center text-sm leading-none">−</span>
            Nuevo egreso
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Últimos movimientos
          </h2>
          {movimientos.length > 0 && (
            <Link
              to="/historial"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Ver todo
            </Link>
          )}
        </div>
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
                className="flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3.5 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl bg-gray-100 dark:bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center shrink-0">{m.categorias?.icono ?? '💰'}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
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
                    className={`text-base font-bold ${
                      m.tipo === 'ingreso' ? 'text-brand-600 dark:text-brand-400' : 'text-loss-600 dark:text-loss-400'
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
