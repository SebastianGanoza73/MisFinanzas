import { useMemo } from 'react'
import { useMovimientos } from '../hooks/useMovimientos'
import { formatMoney } from '../lib/formatters'

function enMes(fechaStr, mes, anio) {
  const fecha = new Date(fechaStr + 'T12:00:00')
  return fecha.getMonth() === mes && fecha.getFullYear() === anio
}

export default function BalanceMensual() {
  const { movimientos, loading } = useMovimientos()

  const stats = useMemo(() => {
    const hoy = new Date()
    const mesActual = hoy.getMonth()
    const anioActual = hoy.getFullYear()

    const fechaAnterior = new Date(anioActual, mesActual - 1, 1)
    const mesAnterior = fechaAnterior.getMonth()
    const anioAnteriorCalc = fechaAnterior.getFullYear()

    let ingresos = 0
    let egresos = 0
    let ingresosAnt = 0
    let egresosAnt = 0

    const categoriasGasto = {}
    const categoriasGastoAnt = {}

    movimientos.forEach((m) => {
      const monto = Number(m.monto)
      const nombre = m.categorias?.nombre ?? 'Sin categoría'
      const icono = m.categorias?.icono ?? '💰'

      if (enMes(m.fecha, mesActual, anioActual)) {
        if (m.tipo === 'ingreso') {
          ingresos += monto
        } else {
          egresos += monto
          if (!categoriasGasto[nombre]) categoriasGasto[nombre] = { total: 0, icono }
          categoriasGasto[nombre].total += monto
        }
      }

      if (enMes(m.fecha, mesAnterior, anioAnteriorCalc)) {
        if (m.tipo === 'ingreso') {
          ingresosAnt += monto
        } else {
          egresosAnt += monto
          if (!categoriasGastoAnt[nombre]) categoriasGastoAnt[nombre] = 0
          categoriasGastoAnt[nombre] += monto
        }
      }
    })

    const ahorro = ingresos - egresos
    const ahorroAnt = ingresosAnt - egresosAnt

    const topCategorias = Object.entries(categoriasGasto)
      .map(([nombre, data]) => ({
        nombre,
        ...data,
        totalAnterior: categoriasGastoAnt[nombre] ?? 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

    const nombreMes = hoy.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })

    return { ingresos, egresos, ahorro, ingresosAnt, egresosAnt, ahorroAnt, topCategorias, nombreMes }
  }, [movimientos])

  const recomendacion = useMemo(() => {
    if (loading) return null
    if (stats.ingresos === 0 && stats.egresos === 0) {
      return 'Aún no tienes movimientos este mes. Registra tus ingresos y gastos para ver recomendaciones.'
    }
    const diffAhorro = stats.ahorro - stats.ahorroAnt
    if (diffAhorro > 0) {
      return `Ahorraste ${formatMoney(diffAhorro)} más que el mes pasado. ¡Vas por buen camino!`
    }
    if (diffAhorro < 0) {
      return `Ahorraste ${formatMoney(Math.abs(diffAhorro))} menos que el mes pasado. Revisa tus categorías de mayor gasto.`
    }
    return 'Tu ahorro se mantiene igual que el mes pasado.'
  }, [stats, loading])

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-8">
        <p className="text-xs uppercase tracking-wide text-brand-100 mb-2">Balance mensual</p>
        <h1 className="text-2xl font-bold mb-1">Tu mes en números</h1>
        <p className="text-sm text-brand-100">
          Revisa tus ingresos, egresos y ahorro del mes, y compara con el mes anterior.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando...</p>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1 capitalize">
              {stats.nombreMes}
            </p>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Balance del mes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-4">
                <p className="text-xs uppercase text-brand-600 dark:text-brand-400 mb-1">↑ Ingresos</p>
                <p className="text-lg font-bold text-brand-700 dark:text-brand-400">
                  {formatMoney(stats.ingresos)}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                <p className="text-xs uppercase text-red-500 dark:text-red-400 mb-1">↓ Egresos</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {formatMoney(stats.egresos)}
                </p>
              </div>
              <div className="bg-gray-800 dark:bg-gray-800 rounded-xl p-4">
                <p className="text-xs uppercase text-gray-300 mb-1">Ahorro del mes</p>
                <p className="text-lg font-bold text-white">{formatMoney(stats.ahorro)}</p>
              </div>
            </div>
          </div>

          {stats.topCategorias.length > 0 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Comparativa</p>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                Categorías principales
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Tus mayores gastos este mes frente al mes anterior
              </p>
              <div className="flex flex-col gap-2">
                {stats.topCategorias.map((c) => {
                  const diff = c.total - c.totalAnterior
                  return (
                    <div
                      key={c.nombre}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <span>{c.icono}</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">{c.nombre}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-red-500">{formatMoney(c.total)}</span>
                        {c.totalAnterior > 0 && (
                          <span
                            className={`text-xs ${
                              diff > 0 ? 'text-red-400' : 'text-brand-500'
                            }`}
                          >
                            {diff >= 0 ? '+' : ''}
                            {formatMoney(diff)} vs. mes pasado
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-6">
            <p className="text-xs uppercase text-amber-600 dark:text-amber-400 mb-1">Recomendaciones</p>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              Cómo mejorar tu ahorro
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">{recomendacion}</p>
          </div>
        </>
      )}
    </div>
  )
}