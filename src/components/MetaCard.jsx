import { formatMoney } from '../lib/formatters'
import TrendArrow from './TrendArrow'

const prioridadColor = {
  alta: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  media: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  baja: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export default function MetaCard({ meta, onEditar, onEliminar, compact = false }) {
  const progreso = Math.min(100, (Number(meta.monto_actual) / Number(meta.monto_objetivo)) * 100)
  const completada = progreso >= 100

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 transition-all">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 truncate">{meta.nombre}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${prioridadColor[meta.prioridad]}`}>
              Prioridad {meta.prioridad}
            </span>
            {completada && (
              <span className="text-xs bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400 px-2.5 py-0.5 rounded-full font-semibold">
                ✓ Completada
              </span>
            )}
          </div>
        </div>
        {!compact && (
          <TrendArrow
            tendencia={meta.tendencia}
            aporteEsteMes={meta.aporteEsteMes}
            aporteMesAnterior={meta.aporteMesAnterior}
          />
        )}
      </div>

      <div className="mb-1">
        <div className="flex justify-between items-baseline text-sm mb-1.5 gap-2">
          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
            {formatMoney(meta.monto_actual)}
          </span>
          <span className="text-gray-500 dark:text-gray-400 font-medium text-sm shrink-0">
            de {formatMoney(meta.monto_objetivo)}
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${completada ? 'bg-brand-500' : 'bg-brand-600'}`}
            style={{ width: `${progreso}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
            {progreso.toFixed(0)}% completado · se actualiza con tus ingresos y gastos
          </p>
          {compact && (
            <TrendArrow
              tendencia={meta.tendencia}
              aporteEsteMes={meta.aporteEsteMes}
              aporteMesAnterior={meta.aporteMesAnterior}
              size="sm"
            />
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {onEditar && (
          <button
            onClick={onEditar}
            aria-label={`Editar ${meta.nombre}`}
            className="flex-1 flex items-center justify-center text-lg bg-gray-50 hover:bg-gray-100 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 py-2.5 rounded-xl active:scale-95 transition-all"
          >
            ✏️
          </button>
        )}
        {onEliminar && (
          <button
            onClick={onEliminar}
            aria-label={`Eliminar ${meta.nombre}`}
            className="flex-1 flex items-center justify-center text-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 py-2.5 rounded-xl active:scale-95 transition-all"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  )
}
