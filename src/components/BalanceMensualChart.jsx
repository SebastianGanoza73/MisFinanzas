import { useState } from 'react'
import { formatMoney, formatFecha } from '../lib/formatters'

const W = 600
const H = 220
const PAD_X = 16
const PAD_TOP = 24
const PAD_BOTTOM = 30

// Gráfico de línea del saldo acumulado del mes: sube cuando entra un
// ingreso, baja cuando hay un egreso — igual a una acción en bolsa.
// Tocar/pasar el mouse sobre un punto muestra fecha, monto y motivo
// de ese movimiento. (La hora exacta no se guarda en la base de datos
// actual, así que el tooltip muestra fecha + monto + motivo.)
export default function BalanceMensualChart({ puntos }) {
  const [activo, setActivo] = useState(null)

  if (!puntos || puntos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 shadow-sm shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
          Tendencia del mes
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Aún no hay movimientos este mes para graficar.
        </p>
      </div>
    )
  }

  const saldos = puntos.map((p) => p.saldo)
  const min = Math.min(0, ...saldos)
  const max = Math.max(0, ...saldos)
  const rango = max - min || 1

  const coords = puntos.map((p, i) => {
    const x = puntos.length === 1 ? W / 2 : PAD_X + (i / (puntos.length - 1)) * (W - PAD_X * 2)
    const y = PAD_TOP + (1 - (p.saldo - min) / rango) * (H - PAD_TOP - PAD_BOTTOM)
    return { ...p, x, y }
  })

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${H - PAD_BOTTOM} L ${coords[0].x} ${H - PAD_BOTTOM} Z`

  const punto = activo !== null ? coords[activo] : null
  const subiendo = punto ? punto.tipo === 'ingreso' : false

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Tendencia del mes
        </p>
        <span className="text-xs text-gray-400 dark:text-gray-500">Toca un punto para ver el detalle</span>
      </div>

      <div className="relative mt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto touch-none select-none">
          <line x1={PAD_X} x2={W - PAD_X} y1={PAD_TOP + (1 - (0 - min) / rango) * (H - PAD_TOP - PAD_BOTTOM)} y2={PAD_TOP + (1 - (0 - min) / rango) * (H - PAD_TOP - PAD_BOTTOM)} stroke="currentColor" className="text-gray-200 dark:text-gray-800" strokeDasharray="4 4" />

          <path d={areaPath} fill="var(--color-brand-500)" opacity="0.08" />
          <path d={linePath} fill="none" stroke="var(--color-brand-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {coords.map((c, i) => (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r={activo === i ? 7 : 5}
              className={`cursor-pointer transition-all ${
                c.tipo === 'ingreso' ? 'fill-brand-500' : 'fill-loss-500'
              } ${activo === i ? 'stroke-white dark:stroke-gray-900' : ''}`}
              strokeWidth={activo === i ? 3 : 0}
              onMouseEnter={() => setActivo(i)}
              onClick={() => setActivo(activo === i ? null : i)}
            />
          ))}
        </svg>

        {punto && (
          <div
            className="absolute z-10 -translate-x-1/2 -translate-y-full bg-gray-900 dark:bg-gray-800 text-white rounded-xl px-3 py-2 text-xs shadow-lg pointer-events-none whitespace-nowrap"
            style={{
              left: `${(punto.x / W) * 100}%`,
              top: `${(punto.y / H) * 100}%`,
              marginTop: '-10px',
            }}
          >
            <p className={`font-bold ${subiendo ? 'text-brand-300' : 'text-loss-300'}`}>
              {subiendo ? '+' : '−'} {formatMoney(punto.monto)}
            </p>
            <p className="text-gray-300">{formatFecha(punto.fecha)}</p>
            <p className="text-gray-300">{punto.motivo}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500" /> Ingreso
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full bg-loss-500" /> Egreso
        </span>
      </div>
    </div>
  )
}
