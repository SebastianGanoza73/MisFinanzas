export function formatFecha(fechaStr) {
  const fecha = new Date(fechaStr + 'T00:00:00')
  return fecha.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatFechaLarga(date = new Date()) {
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatMoney(n) {
  return Number(n).toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })
}

export function getFechaLocal(date = new Date()) {
  // Se arma el string YYYY-MM-DD leyendo directamente año/mes/día locales,
  // sin pasar por UTC. El método anterior (restar el offset y usar
  // toISOString) podía adelantar o atrasar un día según la hora y el
  // huso horario del dispositivo — por eso Modo Express a veces mostraba
  // "10 de agosto" cuando en realidad era 9.
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
