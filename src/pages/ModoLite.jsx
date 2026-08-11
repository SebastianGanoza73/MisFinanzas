import { useState, useMemo, useRef } from 'react'
import { useMovimientos } from '../hooks/useMovimientos'
import { useMode } from '../context/ModeContext'
import { formatMoney, getFechaLocal } from '../lib/formatters'
import MovimientoModal from '../components/MovimientoModal'
import MovimientoAcciones from '../components/MovimientoAcciones'
import ConfirmModal from '../components/ConfirmModal'
import CategoriasModal from '../components/CategoriasModal'
import UserMenu from '../components/UserMenu'
import ThemeToggle from '../components/ThemeToggle'

function toISO(date) {
  return getFechaLocal(date)
}

export default function ModoLite() {
  const { movimientos, loading, addMovimiento, updateMovimiento, deleteMovimiento } = useMovimientos()
  const { toggleMode } = useMode()

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
      if (m.fecha === fecha) delDia.push(m)
    })

    return { balance, movimientosDelDia: delDia }
  }, [movimientos, fecha])

  const fechaFormateada = new Date(fecha + 'T12:00:00').toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const esHoy = fecha === toISO(new Date())

  // Retroceder / avanzar un día con la fecha, con la misma animación
  // suave de entrada que el resto de la app (animate-page-in vía key).
  const cambiarDia = (delta) => {
    const actual = new Date(fecha + 'T12:00:00')
    actual.setDate(actual.getDate() + delta)
    setFecha(toISO(actual))
  }

  const confirmarBorrado = async () => {
    await deleteMovimiento(borrando.id)
    setBorrando(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* HEADER: mismo orden que Modo Estándar (categorías, tema, cambio
          de modo) para que no cambie al alternar entre modos. */}
      <header className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)] px-4 sm:px-6 py-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="text-sm font-bold text-brand-700 dark:text-brand-400 capitalize truncate">
              ⚡ Modo Express
            </p>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 truncate">
              MisFinanzas
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setShowCategorias(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 sm:px-3.5 py-2.5 rounded-xl transition-all active:scale-95"
          >
            🏷️
            <span className="hidden sm:inline">Categorías</span>
          </button>

          <ThemeToggle />

          <button
            onClick={toggleMode}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 sm:px-3.5 py-2.5 rounded-xl transition-all active:scale-95"
          >
            📊
            <span className="hidden sm:inline">Modo Estándar</span>
          </button>

          <UserMenu />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-6 sm:py-8 gap-6 pb-28">
        <div key={fecha} className="w-full max-w-sm md:max-w-3xl flex flex-col gap-6 animate-page-in">
          <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:items-start md:gap-6">
            <div className="flex flex-col gap-5">
              {/* Fecha con flechas para retroceder/avanzar de día */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => cambiarDia(-1)}
                  aria-label="Día anterior"
                  className="w-11 h-11 shrink-0 rounded-2xl bg-white dark:bg-gray-900 shadow-sm shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800 flex items-center justify-center text-lg font-bold text-gray-500 dark:text-gray-400 active:scale-90 transition-transform"
                >
                  ‹
                </button>

                <div className="relative flex-1 cursor-pointer" onClick={() => fechaInputRef.current?.showPicker?.()}>
                  <div className="w-full bg-white dark:bg-gray-900 rounded-2xl py-5 px-4 flex items-center justify-center gap-2 shadow-sm shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800">
                    <span className="text-xl">📅</span>
                    <span className="font-bold text-base sm:text-xl text-gray-900 dark:text-gray-100 capitalize truncate">
                      {fechaFormateada}
                    </span>
                  </div>
                  <input
                    ref={fechaInputRef}
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="absolute inset-0 opacity-0 pointer-events-none"
                  />
                </div>

                <button
                  onClick={() => cambiarDia(1)}
                  aria-label="Día siguiente"
                  className="w-11 h-11 shrink-0 rounded-2xl bg-white dark:bg-gray-900 shadow-sm shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800 flex items-center justify-center text-lg font-bold text-gray-500 dark:text-gray-400 active:scale-90 transition-transform"
                >
                  ›
                </button>
              </div>

              {!esHoy && (
                <button
                  onClick={() => setFecha(toISO(new Date()))}
                  className="text-base text-brand-600 dark:text-brand-400 font-bold underline self-center"
                >
                  Volver a hoy
                </button>
              )}

              <div className="w-full bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl py-8 px-6 flex flex-col items-center gap-1.5 shadow-lg shadow-brand-900/25">
                <span className="font-semibold text-sm text-brand-100 uppercase tracking-widest">Saldo</span>
                <span className={`text-5xl font-extrabold tracking-tight ${balance < 0 ? 'text-rose-100' : 'text-white'}`}>
                  {formatMoney(balance)}
                </span>
              </div>
            </div>

            <div>
              <p className="text-base font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300 mb-3">
                Movimientos de este día
              </p>

              {loading ? (
                <p className="text-lg text-gray-500">Cargando...</p>
              ) : movimientosDelDia.length === 0 ? (
                <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-2xl shadow-sm shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800">
                  <p className="text-base font-medium text-gray-500 dark:text-gray-400">Sin movimientos este día</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {movimientosDelDia.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSeleccionado(m)}
                      className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md active:scale-[0.99] transition-all shadow-sm shadow-gray-200/60 dark:shadow-none"
                    >
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {m.categorias?.nombre ?? 'Sin categoría'}
                      </span>
                      <span className={`text-xl font-extrabold ${m.tipo === 'ingreso' ? 'text-brand-600 dark:text-brand-400' : 'text-loss-600 dark:text-loss-400'}`}>
                        {m.tipo === 'ingreso' ? '+' : '−'} {formatMoney(m.monto)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Botones de Ingreso/Gasto fijos abajo: más rápido de alcanzar
          con el pulgar y se ve más "app", como pidió el cliente. */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="w-full max-w-sm md:max-w-3xl mx-auto flex gap-3">
          <button
            onClick={() => setModalTipo('ingreso')}
            className="flex-1 bg-brand-50 dark:bg-brand-900/20 rounded-2xl py-4 flex items-center justify-center gap-2 font-bold text-lg text-brand-700 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 active:scale-[0.97] transition-all border border-brand-200 dark:border-brand-900/60"
          >
            <span className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-sm">➕</span>
            Ingreso
          </button>

          <button
            onClick={() => setModalTipo('egreso')}
            className="flex-1 bg-loss-50 dark:bg-loss-900/20 rounded-2xl py-4 flex items-center justify-center gap-2 font-bold text-lg text-loss-700 dark:text-loss-400 hover:bg-loss-100 dark:hover:bg-loss-900/30 active:scale-[0.97] transition-all border border-loss-200 dark:border-loss-900/60"
          >
            <span className="w-7 h-7 rounded-full bg-loss-100 dark:bg-loss-900/50 flex items-center justify-center text-sm">➖</span>
            Gasto
          </button>
        </div>
      </div>

      {modalTipo && (
        <MovimientoModal tipo={modalTipo} fechaInicial={fecha} ocultarFecha onClose={() => setModalTipo(null)} onSave={addMovimiento} />
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
        <MovimientoModal tipo={editando.tipo} movimiento={editando} onClose={() => setEditando(null)} onSave={(cambios) => updateMovimiento(editando.id, cambios)} />
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
