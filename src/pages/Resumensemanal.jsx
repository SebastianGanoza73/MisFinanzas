import { useMemo } from 'react'
import { useMovimientos } from '../hooks/useMovimientos'
import { formatMoney } from '../lib/formatters'

function getRangoSemana(offsetSemanas = 0) {
  const hoy = new Date()
  const diaSemana = hoy.getDay() === 0 ? 7 : hoy.getDay() // lunes = 1 ... domingo = 7
  const lunes = new Date(hoy)
  lunes.setDate(hoy.getDate() - diaSemana + 1 + offsetSemanas * 7)
  lunes.setHours(0, 0, 0, 0)

  const domingo = new Date(lunes)
  domingo.setDate(lunes.getDate() + 6)
  domingo.setHours(23, 59, 59, 999)

  return { inicio: lunes, fin: domingo }
}

function enRango(fechaStr, inicio, fin) {
  const fecha = new Date(fechaStr + 'T12:00:00')
  return fecha >= inicio && fecha <= fin
}

export default function ResumenSemanal() {
  const { movimientos, loading } = useMovimientos()

  const stats = useMemo(() => {
    const semanaActual = getRangoSemana(0)
    const semanaAnterior = getRangoSemana(-1)

    let gastoActual = 0
    let ahorroActual = 0
    let ingresoActual = 0
    let gastoAnterior = 0
    let ahorroAnterior = 0

    const categoriasGasto = {}

    movimientos.forEach((m) => {
      const monto = Number(m.monto)

      if (enRango(m.fecha, semanaActual.inicio, semanaActual.fin)) {
        if (m.tipo === 'egreso') {
          gastoActual += monto
          const nombre = m.categorias?.nombre ?? 'Sin categoría'
          const icono = m.categorias?.icono ?? '💰'
          if (!categoriasGasto[nombre]) categoriasGasto[nombre] = { total: 0, icono }
          categoriasGasto[nombre].total += monto
        } else {
          ingresoActual += monto
        }
      }

      if (enRango(m.fecha, semanaAnterior.inicio, semanaAnterior.fin)) {
        if (m.tipo === 'egreso') gastoAnterior += monto
        else ahorroAnterior += monto
      }
    })

    ahorroActual = ingresoActual - gastoActual
    ahorroAnterior = ahorroAnterior - gastoAnterior

    const topCategorias = Object.entries(categoriasGasto)
      .map(([nombre, data]) => ({ nombre, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

    return { gastoActual, ahorroActual, gastoAnterior, ahorroAnterior, topCategorias }
  }, [movimientos])

  const diffGasto = stats.gastoActual - stats.gastoAnterior
  const diffAhorro = stats.ahorroActual - stats.ahorroAnterior

  const recomendacion = useMemo(() => {
    if (loading) return null
    if (stats.gastoActual === 0 && stats.ahorroActual === 0) {
      return 'Aún no tienes movimientos esta semana. Registra tus ingresos y gastos para ver recomendaciones.'
    }
    if (stats.gastoActual === 0) {
      return `Vas muy bien: no registraste gastos esta semana, con un ahorro de ${formatMoney(stats.ahorroActual)}.`
    }
    if (diffGasto > 0) {
      return `Gastaste ${formatMoney(diffGasto)} más que la semana pasada. Revisa tu categoría de mayor gasto para ajustar.`
    }
    if (diffAhorro > 0) {
      return `Vas mejor que la semana pasada: ahorraste ${formatMoney(diffAhorro)} más. ¡Sigue así!`
    }
    return 'Tu semana está en línea con la anterior. Mantén el control de tus gastos.'
  }, [stats, diffGasto, diffAhorro, loading])

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-8">
        <p className="text-xs uppercase tracking-wide text-brand-100 mb-2">Resumen semanal</p>
        <h1 className="text-2xl font-bold mb-1">Tu semana en números</h1>
        <p className="text-sm text-brand-100">
          Compará tu semana actual con la anterior y descubrí recomendaciones automáticas.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando...</p>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Esta semana</p>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Resumen de gasto y ahorro
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                <p className="text-xs uppercase text-red-500 dark:text-red-400 mb-1">Total gastado</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  {formatMoney(stats.gastoActual)}
                </p>
              </div>
              <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-4">
                <p className="text-xs uppercase text-brand-600 dark:text-brand-400 mb-1">Total ahorrado</p>
                <p className="text-xl font-bold text-brand-700 dark:text-brand-400">
                  {formatMoney(stats.ahorroActual)}
                </p>
              </div>
            </div>

            {stats.topCategorias.length > 0 && (
              <div className="mt-6">
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-3">
                  Categorías con más gasto
                </p>
                <div className="flex flex-col gap-2">
                  {stats.topCategorias.map((c) => (
                    <div
                      key={c.nombre}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <span>{c.icono}</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">{c.nombre}</span>
                      </div>
                      <span className="text-sm font-semibold text-red-500">{formatMoney(c.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Comparativa</p>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Esta semana vs. la anterior
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Gasto</p>
                <p
                  className={`text-lg font-bold ${
                    diffGasto > 0 ? 'text-red-500' : 'text-brand-600 dark:text-brand-400'
                  }`}
                >
                  {diffGasto >= 0 ? '+' : ''}
                  {formatMoney(diffGasto)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Semana pasada: {formatMoney(stats.gastoAnterior)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Ahorro</p>
                <p
                  className={`text-lg font-bold ${
                    diffAhorro >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-red-500'
                  }`}
                >
                  {diffAhorro >= 0 ? '+' : ''}
                  {formatMoney(diffAhorro)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Semana pasada: {formatMoney(stats.ahorroAnterior)}
                </p>
              </div>
            </div>
          </div>

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