import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { getFechaLocal } from '../lib/formatters'

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
      .order('created_at', { ascending: false })

    if (error) {
      setLoading(false)
      return
    }

    const { data: aportes } = await supabase
      .from('movimientos')
      .select('meta_id, monto')
      .eq('user_id', user.id)
      .not('meta_id', 'is', null)

    const sumas = {}
    aportes?.forEach((a) => {
      sumas[a.meta_id] = (sumas[a.meta_id] ?? 0) + Number(a.monto)
    })

    const metasConProgreso = metasData.map((m) => ({
      ...m,
      monto_actual: sumas[m.id] ?? 0,
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

  const aportarAMeta = async (id, monto) => {
    const meta = metas.find((m) => m.id === id)
    if (!meta) return { error: { message: 'Meta no encontrada' } }

    const { data: categoriaAhorro } = await supabase
      .from('categorias')
      .select('id')
      .eq('user_id', user.id)
      .eq('nombre', 'Ahorro')
      .single()

    const { error } = await supabase.from('movimientos').insert([
      {
        user_id: user.id,
        tipo: 'egreso',
        monto,
        categoria_id: categoriaAhorro?.id ?? null,
        meta_id: id,
        descripcion: `Aporte a "${meta.nombre}"`,
        fecha: getFechaLocal(),
      },
    ])

    if (!error) await fetchMetas()
    return { error }
  }

  return { metas, loading, addMeta, updateMeta, deleteMeta, aportarAMeta, refetch: fetchMetas }
}