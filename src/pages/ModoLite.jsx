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
    weekday: 'long',
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <span className="text-brand-600 dark:text-brand-400 text-xl">📈</span>
          <span className="font-bold text-gray-900 dark:text-gray-100">MisFinanzas Lite</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={toggleMode}
            className="text-sm font-medium px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
          >
            Modo estándar
          </button>
          <button
            onClick={signOut}
            className="text-sm font-medium px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8 gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => cambiarDia(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-lg"
            aria-label="Día anterior"
          >
            ←
          </button>

          <div className="relative">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize text-center min-w-[220px]">
              {fechaFormateada}
            </p>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <button
            onClick={() => cambiarDia(1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-lg"
            aria-label="Día siguiente"
          >
            →
          </button>
        </div>

        {!esHoy && (
          <button
            onClick={() => setFecha(toISO(new Date()))}
            className="text-xs text-brand-600 dark:text-brand-400 font-medium -mt-4"
          >
            Volver a hoy
          </button>
        )}

        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
            Saldo acumulado
          </p>
          <p className={`text-5xl font-bold ${balance < 0 ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'}`}>
            {formatMoney(balance)}
          </p>
        </div>

        <div className="flex gap-3 w-full max-w-sm">
          <button
            onClick={() => setModalTipo('ingreso')}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            + Ingreso
          </button>
          <button
            onClick={() => setModalTipo('egreso')}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-colors"
          >
            − Egreso
          </button>
        </div>

        <div className="w-full max-w-sm">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
            Movimientos de este día
          </p>
          {loading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Cargando...</p>
          ) : movimientosDelDia.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
              Sin movimientos este día
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {movimientosDelDia.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSeleccionado(m)}
                  className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 hover:border-brand-400 dark:hover:border-brand-600 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{m.categorias?.icono ?? '💰'}</span>
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
      </main>

      {modalTipo && (
        <MovimientoModal
          tipo={modalTipo}
          fechaInicial={fecha}
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
