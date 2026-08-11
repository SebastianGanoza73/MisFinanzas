import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useMovimientos() {
  const { user } = useAuth()
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMovimientos = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('movimientos')
      .select('*, categorias(nombre, icono)')
      .eq('user_id', user.id)
      .order('fecha', { ascending: false })

    if (!error) setMovimientos(data)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchMovimientos()
  }, [fetchMovimientos])

  const addMovimiento = async (movimiento) => {
    const { error } = await supabase
      .from('movimientos')
      .insert([{ ...movimiento, user_id: user.id }])
    if (!error) await fetchMovimientos()
    return { error }
  }

  const updateMovimiento = async (id, cambios) => {
    const { error } = await supabase
      .from('movimientos')
      .update(cambios)
      .eq('id', id)
    if (!error) await fetchMovimientos()
    return { error }
  }

  const deleteMovimiento = async (id) => {
    const { error } = await supabase
      .from('movimientos')
      .delete()
      .eq('id', id)
    if (!error) await fetchMovimientos()
    return { error }
  }

  return { movimientos, loading, addMovimiento, updateMovimiento, deleteMovimiento, refetch: fetchMovimientos }
}
