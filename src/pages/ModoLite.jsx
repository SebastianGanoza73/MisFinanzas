import { useState, useMemo, useRef } from 'react'
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
  const dateInputRef = useRef(null)

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

  const abrirCalendario = () => {
    if (dateInputRef.current?.showPicker) {
      dateInputRef.current.showPicker()
    } else {
      dateInputRef.current?.click()
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-brand-600 dark:text-brand-400 text-xl">📈</span>
          <span className="font-bold text-gray-900 dark:text-gray-100">MisFinanzas</span>
          <span className="text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full">
            Lite
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-800 transition-colors shadow-sm bg-white/60 dark:bg-gray-900/60"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={toggleMode}
            className="text-sm font-medium px-3 py-2 rounded-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 shadow-sm hover:shadow transition-shadow"
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => cambiarDia(-1)}
              className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-sm text-gray-500 dark:text-gray-300 hover:shadow transition-shadow"
              aria-label="Día anterior"
            >
              ←
            </button>

            <button
              onClick={abrirCalendario}
              className="relative flex-1 bg-white dark:bg-gray-900 rounded-2xl py-3.5 px-4 shadow-sm hover:shadow transition-shadow flex items-center justify-center gap-2"
            >
              <span className="text-brand-500">📅</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                {fechaFormateada}
              </span>
              <input
                ref={dateInputRef}
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="absolute inset-0 opacity-0 pointer-events-none"
                tabIndex={-1}
              />
            </button>

            <button
              onClick={() => cambiarDia(1)}
              className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-sm text-gray-500 dark:text-gray-300 hover:shadow transition-shadow"
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
          <div className="rounded-2xl py-6 px-6 bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-md">
            <p className="text-xs uppercase tracking-wide text-brand-100 mb-1">Saldo acumulado</p>
            <p className={`text-4xl font-bold ${balance < 0 ? 'text-red-200' : 'text-white'}`}>
              {formatMoney(balance)}
            </p>
          </div>

          {/* Botones */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setModalTipo('ingreso')}
              className="py-3.5 rounded-2xl font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm hover:shadow-md transition-all"
            >
              + Ingreso
            </button>
            <button
              onClick={() => setModalTipo('egreso')}
              className="py-3.5 rounded-2xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm hover:shadow-md transition-all"
            >
              − Gasto
            </button>
          </div>

          {/* Movimientos del día */}
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 mt-2">
              Movimientos de este día
            </p>
            {loading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Cargando...</p>
            ) : movimientosDelDia.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm py-8 text-center">
                <p className="text-sm text-gray-400 dark:text-gray-500">Sin movimientos este día</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {movimientosDelDia.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSeleccionado(m)}
                    className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-2xl px-4 py-3 shadow-sm hover:shadow transition-shadow text-left"
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
