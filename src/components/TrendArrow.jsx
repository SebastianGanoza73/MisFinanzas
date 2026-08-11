import { formatMoney } from '../lib/formatters'

// Pequeño gráfico tipo "acción en bolsa": sube en verde cuando este mes se
// aportó más que el mes pasado, baja en rojo cuando se aportó menos.
// Es una señal de RITMO de ahorro, no del monto total (ese ya lo muestra
// la barra de progreso).
export default function TrendArrow({ tendencia, aporteEsteMes, aporteMesAnterior, size = 'md' }) {
  const isUp = tendencia === 'up'
  const isDown = tendencia === 'down'

  const color = isUp
    ? 'text-brand-600 dark:text-brand-400'
    : isDown
    ? 'text-red-500 dark:text-red-400'
    : 'text-gray-400 dark:text-gray-500'

  const bg = isUp
    ? 'bg-brand-50 dark:bg-brand-900/25'
    : isDown
    ? 'bg-red-50 dark:bg-red-900/20'
    : 'bg-gray-100 dark:bg-gray-800'

  const dims = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9'

  const label = isUp
    ? 'Ahorrando más rápido que el mes pasado'
    : isDown
    ? 'Ahorrando más despacio que el mes pasado'
    : 'Ritmo de aporte estable'

  return (
    <div className="flex items-center gap-1.5" title={label}>
      <span className={`${dims} rounded-full ${bg} flex items-center justify-center shrink-0 animate-trend-pop`}>
        <svg viewBox="0 0 24 24" className={`w-4 h-4 ${color}`} fill="none">
          {isDown ? (
            <path
              d="M4 7l6 6 3.5-3.5L20 16M20 16v-5M20 16h-5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M4 17l6-6 3.5 3.5L20 8M20 8v5M20 8h-5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </span>
      {size !== 'sm' && (
        <span className={`text-xs font-semibold ${color}`}>
          {isUp && `+${formatMoney(aporteEsteMes)} este mes`}
          {isDown && `${formatMoney(aporteEsteMes)} este mes`}
          {!isUp && !isDown && (aporteEsteMes > 0 ? `${formatMoney(aporteEsteMes)} este mes` : 'Sin aportes aún')}
        </span>
      )}
    </div>
  )
}
