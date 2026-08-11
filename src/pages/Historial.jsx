import { useState, useMemo } from 'react'
import { useMovimientos } from '../hooks/useMovimientos'
import { useCategorias } from '../hooks/useCategorias'
import { formatFecha, formatMoney } from '../lib/formatters'
import MovimientoModal from '../components/MovimientoModal'
import MovimientoAcciones from '../components/MovimientoAcciones'
import ConfirmModal from '../components/ConfirmModal'

// Meses para el filtro rápido "de qué mes" (además del rango desde/hasta).
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export default function Historial() {
  const { movimientos, loading, updateMovimiento, deleteMovimiento } = useMovimientos()
  const { categorias } = useCategorias()

  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [tipo, setTipo] = useState('todos')
  const [categoriaId, setCategoriaId] = useState('todas')
  const [mes, setMes] = useState('todos')
  const [showFiltros, setShowFiltros] = useState(false)

  const [seleccionado, setSeleccionado] = useState(null)
  const [editando, setEditando] = useState(null)
  const [borrando, setBorrando] = useState(null)

  const filtrados = useMemo(() => {
    return movimientos.filter((m) => {
      if (desde && m.fecha < desde) return false
      if (hasta && m.fecha > hasta) return false
      if (tipo !== 'todos' && m.tipo !== tipo) return false
      if (categoriaId !== 'todas' && m.categoria_id !== categoriaId) return false
      if (mes !== 'todos' && String(new Date(m.fecha + 'T12:00:00').getMonth()) !== mes) return false
      return true
    })
  }, [movimientos, desde, hasta, tipo, categoriaId, mes])

  const confirmarBorrado = async () => {
    await deleteMovimiento(borrando.id)
    setBorrando(null)
  }

  const limpiarFiltros = () => {
    setDesde('')
    setHasta('')
    setTipo('todos')
    setCategoriaId('todas')
    setMes('todos')
  }

  const filtrosActivos = [
    desde, hasta,
    tipo !== 'todos', categoriaId !== 'todas', mes !== 'todos',
  ].filter(Boolean).length

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-6 sm:p-8 shadow-lg shadow-brand-900/15">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-100 mb-2">Historial</p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 tracking-tight">Tus movimientos, claros y ordenados</h1>
        <p className="text-sm text-brand-100">Filtra, revisa y organiza cada ingreso y egreso registrado.</p>
      </div>

      <button
        onClick={() => setShowFiltros(true)}
        className="flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3.5 hover:border-brand-300 dark:hover:border-brand-600 transition-all active:scale-[0.99]"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          🔍 Filtros
          {filtrosActivos > 0 && (
            <span className="w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-brand-600 text-white">
              {filtrosActivos}
            </span>
          )}
        </span>
        <span className="text-gray-400 dark:text-gray-500">›</span>
      </button>

      {showFiltros && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-end sm:items-center justify-center z-50 animate-fade-in"
          onMouseDown={(e) => e.target === e.currentTarget && setShowFiltros(false)}
        >
          <div className="w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-black/10 p-6 max-h-[85vh] overflow-y-auto animate-slide-up sm:animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Filtros</h2>
              <button
                onClick={() => setShowFiltros(false)}
                aria-label="Cerrar"
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300 font-bold text-lg leading-none transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Categoría</label>
                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
                >
                  <option value="todas">Todas</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icono} {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Mes</label>
                  <select
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
                  >
                    <option value="todos">Todos</option>
                    {MESES.map((m, i) => (
                      <option key={m} value={String(i)}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Tipo</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
                  >
                    <option value="todos">Todos</option>
                    <option value="ingreso">Ingreso</option>
                    <option value="egreso">Egreso</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Desde</label>
                  <input
                    type="date"
                    value={desde}
                    onChange={(e) => setDesde(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Hasta</label>
                  <input
                    type="date"
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={limpiarFiltros}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => setShowFiltros(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all shadow-sm"
                >
                  Filtrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
          Movimientos {!loading && `(${filtrados.length})`}
        </p>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando...</p>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {movimientos.length === 0
                ? 'Aún no tienes movimientos registrados.'
                : 'No hay movimientos que coincidan con los filtros.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
            {filtrados.map((m) => (
              <button
                key={m.id}
                onClick={() => setSeleccionado(m)}
                className="flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3.5 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{m.categorias?.icono ?? '💰'}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {m.categorias?.nombre ?? 'Sin categoría'}
                    </p>
                    {m.descripcion && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {m.descripcion}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <p
                    className={`text-base font-bold ${
                      m.tipo === 'ingreso' ? 'text-brand-600 dark:text-brand-400' : 'text-loss-600 dark:text-loss-400'
                    }`}
                  >
                    {m.tipo === 'ingreso' ? '+' : '−'} {formatMoney(m.monto)}
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
