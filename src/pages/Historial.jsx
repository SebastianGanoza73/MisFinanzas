import { useState, useMemo } from 'react'
import { useMovimientos } from '../hooks/useMovimientos'
import { useCategorias } from '../hooks/useCategorias'
import { formatFecha, formatMoney } from '../lib/formatters'
import MovimientoModal from '../components/MovimientoModal'
import MovimientoAcciones from '../components/MovimientoAcciones'
import ConfirmModal from '../components/ConfirmModal'

export default function Historial() {
  const { movimientos, loading, updateMovimiento, deleteMovimiento } = useMovimientos()
  const { categorias } = useCategorias()

  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [tipo, setTipo] = useState('todos')
  const [categoriaId, setCategoriaId] = useState('todas')

  const [seleccionado, setSeleccionado] = useState(null)
  const [editando, setEditando] = useState(null)
  const [borrando, setBorrando] = useState(null)

  const filtrados = useMemo(() => {
    return movimientos.filter((m) => {
      if (desde && m.fecha < desde) return false
      if (hasta && m.fecha > hasta) return false
      if (tipo !== 'todos' && m.tipo !== tipo) return false
      if (categoriaId !== 'todas' && m.categoria_id !== categoriaId) return false
      return true
    })
  }, [movimientos, desde, hasta, tipo, categoriaId])

  const confirmarBorrado = async () => {
    await deleteMovimiento(borrando.id)
    setBorrando(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-8">
        <p className="text-xs uppercase tracking-wide text-brand-100 mb-2">Historial</p>
        <h1 className="text-2xl font-bold mb-1">Tus movimientos, claros y ordenados</h1>
        <p className="text-sm text-brand-100">Filtra, revisa y organiza cada ingreso y egreso registrado.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Filtros</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="todos">Todos</option>
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">Categoría</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="todas">Todas</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icono} {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
                className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 hover:border-brand-400 dark:hover:border-brand-600 transition-colors text-left"
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
                    className={`text-sm font-semibold ${
                      m.tipo === 'ingreso' ? 'text-brand-600 dark:text-brand-400' : 'text-red-500'
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