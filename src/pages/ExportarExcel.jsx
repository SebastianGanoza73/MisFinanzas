import { useState, useMemo } from 'react'
import ExcelJS from 'exceljs'
import { useMovimientos } from '../hooks/useMovimientos'
import { formatFecha, getFechaLocal } from '../lib/formatters'

function getRangoFechas(rango) {
  const hoyStr = getFechaLocal()
  const hoy = new Date(hoyStr + 'T23:59:59')
  let inicioStr

  if (rango === 'semana') {
    const d = new Date(hoyStr + 'T00:00:00')
    d.setDate(d.getDate() - 7)
    inicioStr = d.toISOString().slice(0, 10)
  } else if (rango === 'mes') {
    const d = new Date(hoyStr + 'T00:00:00')
    d.setMonth(d.getMonth() - 1)
    inicioStr = d.toISOString().slice(0, 10)
  } else if (rango === 'todo') {
    inicioStr = '2000-01-01'
  } else {
    inicioStr = hoyStr
  }

  return { inicio: new Date(inicioStr + 'T00:00:00'), fin: hoy }
}

const VERDE = 'FF059669'
const ROJO = 'FFDC2626'
const GRIS_CLARO = 'FFF1F5F9'
const BLANCO = 'FFFFFFFF'

export default function ExportarExcel() {
  const { movimientos } = useMovimientos()
  const [rango, setRango] = useState('semana')
  const [tipo, setTipo] = useState('ambos')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')

  const filtrados = useMemo(() => {
    let inicio, fin

    if (rango === 'personalizado') {
      inicio = desde ? new Date(desde + 'T00:00:00') : new Date(2000, 0, 1)
      fin = hasta ? new Date(hasta + 'T23:59:59') : new Date()
    } else {
      ;({ inicio, fin } = getRangoFechas(rango))
    }

    return movimientos.filter((m) => {
      const fecha = new Date(m.fecha + 'T12:00:00')
      if (fecha < inicio || fecha > fin) return false
      if (tipo !== 'ambos' && m.tipo !== tipo) return false
      return true
    })
  }, [movimientos, rango, tipo, desde, hasta])

  const handleExportar = async () => {
    if (filtrados.length === 0) {
      alert('No hay movimientos en el rango seleccionado.')
      return
    }

    const totalIngresos = filtrados
      .filter((m) => m.tipo === 'ingreso')
      .reduce((s, m) => s + Number(m.monto), 0)
    const totalEgresos = filtrados
      .filter((m) => m.tipo === 'egreso')
      .reduce((s, m) => s + Number(m.monto), 0)
    const ahorro = totalIngresos - totalEgresos

    const gastoPorCategoria = {}
    filtrados
      .filter((m) => m.tipo === 'egreso')
      .forEach((m) => {
        const cat = m.categorias?.nombre ?? 'Sin categoría'
        gastoPorCategoria[cat] = (gastoPorCategoria[cat] ?? 0) + Number(m.monto)
      })

    const wb = new ExcelJS.Workbook()
    wb.creator = 'MisFinanzas'

    // ---------- Hoja Resumen ----------
    const wsResumen = wb.addWorksheet('Resumen')
    wsResumen.columns = [{ width: 26 }, { width: 16 }]

    wsResumen.mergeCells('A1:B1')
    const titulo = wsResumen.getCell('A1')
    titulo.value = 'MisFinanzas — Resumen'
    titulo.font = { size: 16, bold: true, color: { argb: BLANCO } }
    titulo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: VERDE } }
    titulo.alignment = { vertical: 'middle' }
    wsResumen.getRow(1).height = 28

    const filasResumen = [
      ['Total ingresos', totalIngresos, VERDE],
      ['Total egresos', totalEgresos, ROJO],
      ['Ahorro', ahorro, ahorro >= 0 ? VERDE : ROJO],
    ]
    filasResumen.forEach(([label, valor, color], i) => {
      const row = wsResumen.getRow(i + 3)
      row.getCell(1).value = label
      row.getCell(1).font = { bold: true }
      row.getCell(2).value = valor
      row.getCell(2).numFmt = '"S/" #,##0.00'
      row.getCell(2).font = { bold: true, color: { argb: color } }
    })

    let fila = 7
    wsResumen.getCell(`A${fila}`).value = 'Gasto por categoría'
    wsResumen.getCell(`A${fila}`).font = { bold: true, size: 12 }
    fila++

    Object.entries(gastoPorCategoria)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, monto]) => {
        const row = wsResumen.getRow(fila)
        row.getCell(1).value = cat
        row.getCell(2).value = monto
        row.getCell(2).numFmt = '"S/" #,##0.00'
        row.getCell(2).font = { color: { argb: ROJO } }
        fila++
      })

    // ---------- Hoja Detalle ----------
    const wsDetalle = wb.addWorksheet('Detalle')
    wsDetalle.columns = [
      { header: 'Fecha', key: 'fecha', width: 14 },
      { header: 'Tipo', key: 'tipo', width: 10 },
      { header: 'Categoría', key: 'categoria', width: 18 },
      { header: 'Descripción', key: 'descripcion', width: 30 },
      { header: 'Monto', key: 'monto', width: 14 },
    ]

    const headerRow = wsDetalle.getRow(1)
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: BLANCO } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: VERDE } }
      cell.alignment = { vertical: 'middle' }
    })
    headerRow.height = 20
    wsDetalle.views = [{ state: 'frozen', ySplit: 1 }]

    filtrados.forEach((m, i) => {
      const esIngreso = m.tipo === 'ingreso'
      const row = wsDetalle.addRow({
        fecha: formatFecha(m.fecha),
        tipo: esIngreso ? 'Ingreso' : 'Egreso',
        categoria: m.categorias?.nombre ?? 'Sin categoría',
        descripcion: m.descripcion ?? '',
        monto: Number(m.monto),
      })

      row.getCell('monto').numFmt = '"S/" #,##0.00'
      row.getCell('tipo').font = { bold: true, color: { argb: esIngreso ? VERDE : ROJO } }
      row.getCell('monto').font = { color: { argb: esIngreso ? VERDE : ROJO } }

      if (i % 2 === 1) {
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRIS_CLARO } }
        })
      }
    })

    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `MisFinanzas_${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white p-8">
        <p className="text-xs uppercase tracking-wide text-brand-100 mb-2">Exportar datos</p>
        <h1 className="text-2xl font-bold mb-1">Exporta tus movimientos a Excel</h1>
        <p className="text-sm text-brand-100">
          Elige un rango de fechas y un tipo de movimiento, y descarga un archivo listo para tus registros.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Configuración</p>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Rango y filtros de exportación
          </h2>
        </div>

        <div>
          <label className="text-sm text-gray-700 dark:text-gray-300">Rango de exportación</label>
          <select
            value={rango}
            onChange={(e) => setRango(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="semana">Última semana</option>
            <option value="mes">Último mes</option>
            <option value="todo">Todo</option>
            <option value="personalizado">Personalizado</option>
          </select>
        </div>

        {rango === 'personalizado' && (
          <div className="grid grid-cols-2 gap-3">
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
          </div>
        )}

        <div>
          <label className="text-sm text-gray-700 dark:text-gray-300">Tipo de transacción</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="ambos">Ambos</option>
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          {filtrados.length} movimiento{filtrados.length !== 1 ? 's' : ''} en el rango seleccionado.
        </p>

        <button
          onClick={handleExportar}
          className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          📥 Descargar Excel
        </button>
      </div>
    </div>
  )
}