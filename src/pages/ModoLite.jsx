import { useState, useMemo, useRef } from 'react'
import { useMovimientos } from '../hooks/useMovimientos'
import { useMode } from '../context/ModeContext'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { formatMoney } from '../lib/formatters'
import MovimientoModal from '../components/MovimientoModal'
import MovimientoAcciones from '../components/MovimientoAcciones'
import ConfirmModal from '../components/ConfirmModal'
import CategoriasModal from '../components/CategoriasModal'

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
  const [showCategorias, setShowCategorias] = useState(false)
  const fechaInputRef = useRef(null)

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
      <header className="flex items-center justify-between px-4 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-brand-600 dark:text-brand-400 text-xl">📈</span>
          <span className="font-bold text-gray-900 dark:text-gray-100">MisFinanzas Express</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCategorias(true)}
            aria-label="Categorías"
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors text-xl"
          >
            🏷️
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={toggleMode}
            aria-label="Cambiar a modo estándar"
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xl"
          >
            📊
          </button>
          <button
            onClick={signOut}
            className="text-sm font-medium px-3 py-2 rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-6 gap-5">
        <div className="w-full max-w-sm flex flex-col gap-5">
          {/* Fecha — tocar abre el calendario nativo */}
          <div
            className="relative cursor-pointer"
            onClick={() => fechaInputRef.current?.showPicker?.()}
          >
            <div className="w-full bg-white dark:bg-gray-900 border-4 border-brand-500 rounded-2xl py-6 px-4 flex items-center justify-center gap-3 shadow-md shadow-brand-500/10">
              <span className="text-2xl">📅</span>
              <span className="font-extrabold text-2xl text-gray-900 dark:text-gray-100 capitalize leading-tight">
                {fechaFormateada}
              </span>
            </div>
            <input
              ref={fechaInputRef}
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="absolute inset-0 opacity-0 pointer-events-none"
              aria-label="Elegir fecha"
            />
          </div>

          {!esHoy && (
            <button
              onClick={() => setFecha(toISO(new Date()))}
              className="text-base text-brand-600 dark:text-brand-400 font-bold -mt-2 self-center underline"
            >
              Volver a hoy
            </button>
          )}

          {/* Saldo — degradado como el resto de la app */}
          <div className="w-full bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl py-7 px-6 flex flex-col items-center gap-1 shadow-lg shadow-brand-900/20">
            <span className="font-bold text-lg text-brand-100 uppercase tracking-wide">Saldo</span>
            <span
              className={`text-4xl font-extrabold ${balance < 0 ? 'text-red-200' : 'text-white'}`}
            >
              {formatMoney(balance)}
            </span>
          </div>

          {/* Botones */}
          <button
            onClick={() => setModalTipo('ingreso')}
            className="w-full bg-white dark:bg-gray-900 border-4 border-brand-500 rounded-2xl py-6 flex items-center justify-center gap-3 font-extrabold text-2xl text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors shadow-sm"
          >
            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-2xl">+</span>
            Ingreso
          </button>

          <button
            onClick={() => setModalTipo('egreso')}
            className="w-full bg-white dark:bg-gray-900 border-4 border-red-500 rounded-2xl py-6 flex items-center justify-center gap-3 font-extrabold text-2xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
          >
            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 text-2xl">−</span>
            Gasto
          </button>

          {/* Movimientos del día */}
          <div>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
              Movimientos de este día
            </p>
            {loading ? (
              <p className="text-lg text-gray-500 dark:text-gray-400">Cargando...</p>
            ) : movimientosDelDia.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                  Sin movimientos este día
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {movimientosDelDia.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSeleccionado(m)}
                    className="flex items-center justify-between bg-white dark:bg-gray-900 border-4 border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 hover:border-brand-400 dark:hover:border-brand-600 transition-colors text-left shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-2xl">
                        {m.categorias?.icono ?? '💰'}
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {m.categorias?.nombre ?? 'Sin categoría'}
                      </span>
                    </div>
                    <span
                      className={`text-lg font-extrabold ${
                        m.tipo === 'ingreso' ? 'text-brand-700 dark:text-brand-400' : 'text-red-600'
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

      {showCategorias && <CategoriasModal onClose={() => setShowCategorias(false)} />}
    </div>
  )
}
