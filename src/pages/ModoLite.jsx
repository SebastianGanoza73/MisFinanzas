import { useState, useMemo } from 'react'
import { useMovimientos } from '../hooks/useMovimientos'
import { useMode } from '../context/ModeContext'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { formatMoney } from '../lib/formatters'
import MovimientoModal from '../components/MovimientoModal'
import MovimientoAcciones from '../components/MovimientoAcciones'
import ConfirmModal from '../components/ConfirmModal'

function toISO(date) {
  return date.toISOString().slice(0, 10)
}

export default function ModoLite() {
  const { movimientos, loading, addMovimiento, updateMovimiento, deleteMovimiento } = useMovimientos()
  const { toggleMode } = useMode()
  const { theme, toggleTheme } = useTheme()
  const { signOut } = useAuth()

  const [fecha, setFecha] = useState(() => toISO(new Date()))
  const [modalTipo, setModalTipo] = useState(null)
  const [seleccionado, setSeleccionado] = useState(null)
  const [editando, setEditando] = useState(null)
  const [borrando, setBorrando] = useState(null)

  const cambiarDia = (delta) => {
    const d = new Date(fecha + 'T12:00:00')
    d.setDate(d.getDate() + delta)
    setFecha(toISO(d))
  }

  const { balance, movimientosDelDia } = useMemo(() => {
    let balance = 0
    const delDia = []

    movimientos.forEach((m) => {
      if (m.fecha <= fecha) {
        balance += m.tipo === 'ingreso' ? Number(m.monto) : -Number(m.monto)
      }
      if (m.fecha === fecha) {
        delDia.push(m)
      }
    })

    return { balance, movimientosDelDia: delDia }
  }, [movimientos, fecha])

  const fechaFormateada = new Date(fecha + 'T12:00:00').toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const esHoy = fecha === toISO(new Date())

  const confirmarBorrado = async () => {
    await deleteMovimiento(borrando.id)
    setBorrando(null)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <header className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-brand-600 dark:text-brand-400 text-xl">📈</span>
          <span className="font-bold text-gray-900 dark:text-gray-100">MisFinanzas Lite</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={toggleMode}
            className="text-sm font-medium px-3 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Modo estándar
          </button>
          <button
            onClick={signOut}
            className="text-sm font-medium px-3 py-2 rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-6 gap-4">
        <div className="w-full max-w-sm flex flex-col gap-4">
          {/* Fecha */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => cambiarDia(-1)}
              className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Día anterior"
            >
              ←
            </button>

            <div className="relative flex-1">
              <div className="w-full border-2 border-brand-500 rounded-full py-3 text-center font-semibold text-gray-900 dark:text-gray-100 capitalize">
                {fechaFormateada}
              </div>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <button
              onClick={() => cambiarDia(1)}
              className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              aria-label="Día siguiente"
            >
              →
            </button>
          </div>

          {!esHoy && (
            <button
              onClick={() => setFecha(toISO(new Date()))}
              className="text-xs text-brand-600 dark:text-brand-400 font-medium -mt-2 self-center"
            >
              Volver a hoy
            </button>
          )}

          {/* Saldo */}
          <div className="w-full border-2 border-brand-500 rounded-full py-3 px-6 flex items-center justify-between">
            <span className="font-semibold text-gray-900 dark:text-gray-100">Saldo:</span>
            <span
              className={`text-xl font-bold ${
                balance < 0 ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {formatMoney(balance)}
            </span>
          </div>

          {/* Botones */}
          <button
            onClick={() => setModalTipo('ingreso')}
            className="w-full border-2 border-brand-500 rounded-full py-3 font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
          >
            Ingreso +
          </button>

          <button
            onClick={() => setModalTipo('egreso')}
            className="w-full border-2 border-red-400 rounded-full py-3 font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Gastos −
          </button>

          {/* Movimientos del día */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Movimientos de la misma fecha:
            </p>
            {loading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Cargando...</p>
            ) : movimientosDelDia.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
                Sin movimientos este día
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {movimientosDelDia.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSeleccionado(m)}
                    className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2.5 hover:border-brand-400 dark:hover:border-brand-600 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span>{m.categorias?.icono ?? '💰'}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {m.categorias?.nombre ?? 'Sin categoría'}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        m.tipo === 'ingreso' ? 'text-brand-600 dark:text-brand-400' : 'text-red-500'
                      }`}
                    >
                      {m.tipo === 'ingreso' ? '+' : '−'} {formatMoney(m.monto)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {modalTipo && (
        <MovimientoModal
          tipo={modalTipo}
          fechaInicial={fecha}
          ocultarFecha
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
