import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// Orden de prioridad para repartir el ahorro disponible entre metas.
const ORDEN_PRIORIDAD = { alta: 0, media: 1, baja: 2 }

export function useMetas() {
  const { user } = useAuth()
  const [metas, setMetas] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMetas = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const { data: metasData, error } = await supabase
      .from('metas_ahorro')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      setLoading(false)
      return
    }

    // La app es visual (no está conectada al banco), así que en vez de
    // pedirle a la persona que "aporte" manualmente a cada meta, el
    // progreso se calcula solo a partir de lo que ya registró como
    // ingresos y egresos: el ahorro neto disponible se reparte entre
    // las metas por prioridad (alta primero) y luego por antigüedad,
    // llenando cada una hasta su objetivo antes de pasar a la siguiente.
    // Si hay egresos, el ahorro disponible baja y el progreso baja con él.
    const { data: movimientos } = await supabase
      .from('movimientos')
      .select('tipo, monto, fecha')
      .eq('user_id', user.id)

    let ahorroDisponible = 0
    const ahorroPorMes = {}
    movimientos?.forEach((m) => {
      const monto = Number(m.monto)
      ahorroDisponible += m.tipo === 'ingreso' ? monto : -monto

      const clave = m.fecha.slice(0, 7) // YYYY-MM
      ahorroPorMes[clave] = (ahorroPorMes[clave] ?? 0) + (m.tipo === 'ingreso' ? monto : -monto)
    })
    ahorroDisponible = Math.max(0, ahorroDisponible)

    const ahora = new Date()
    const claveMesActual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`
    const mesAnteriorDate = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)
    const claveMesAnterior = `${mesAnteriorDate.getFullYear()}-${String(mesAnteriorDate.getMonth() + 1).padStart(2, '0')}`
    const aporteEsteMesTotal = ahorroPorMes[claveMesActual] ?? 0
    const aporteMesAnteriorTotal = ahorroPorMes[claveMesAnterior] ?? 0

    const ordenadas = [...metasData].sort((a, b) => {
      const p = ORDEN_PRIORIDAD[a.prioridad] - ORDEN_PRIORIDAD[b.prioridad]
      if (p !== 0) return p
      return new Date(a.created_at) - new Date(b.created_at)
    })

    let restante = ahorroDisponible
    const asignado = {}
    ordenadas.forEach((m) => {
      const objetivo = Number(m.monto_objetivo)
      const monto = Math.min(objetivo, restante)
      asignado[m.id] = monto
      restante -= monto
    })

    let tendencia = 'flat'
    if (aporteEsteMesTotal > aporteMesAnteriorTotal) tendencia = 'up'
    else if (aporteEsteMesTotal < aporteMesAnteriorTotal) tendencia = 'down'

    const metasConProgreso = metasData.map((m) => ({
      ...m,
      monto_actual: asignado[m.id] ?? 0,
      aporteEsteMes: aporteEsteMesTotal,
      aporteMesAnterior: aporteMesAnteriorTotal,
      tendencia,
    }))

    setMetas(metasConProgreso)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchMetas()
  }, [fetchMetas])

  const addMeta = async (meta) => {
    const { error } = await supabase
      .from('metas_ahorro')
      .insert([{ ...meta, user_id: user.id }])
    if (!error) await fetchMetas()
    return { error }
  }

  const updateMeta = async (id, cambios) => {
    const { error } = await supabase
      .from('metas_ahorro')
      .update(cambios)
      .eq('id', id)
    if (!error) await fetchMetas()
    return { error }
  }

  const deleteMeta = async (id) => {
    const { error } = await supabase
      .from('metas_ahorro')
      .delete()
      .eq('id', id)
    if (!error) await fetchMetas()
    return { error }
  }

  return { metas, loading, addMeta, updateMeta, deleteMeta, refetch: fetchMetas }
}
