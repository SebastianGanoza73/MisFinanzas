import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

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
    // progreso de CADA meta se calcula de forma independiente a partir del
    // ahorro neto disponible (ingresos - egresos): cada meta muestra su
    // propio porcentaje hasta su propio objetivo, usando el mismo ahorro
    // total. (Antes se repartía como una sola bolsa entre metas por
    // prioridad, así que si dos metas compartían prioridad, solo la más
    // antigua mostraba avance y a la otra "no le tocaba" nada — ya no.)
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

    let tendencia = 'flat'
    if (aporteEsteMesTotal > aporteMesAnteriorTotal) tendencia = 'up'
    else if (aporteEsteMesTotal < aporteMesAnteriorTotal) tendencia = 'down'

    const metasConProgreso = metasData.map((m) => ({
      ...m,
      monto_actual: Math.min(Number(m.monto_objetivo), ahorroDisponible),
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
