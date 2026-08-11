import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useCategorias() {
  const { user } = useAuth()
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategorias = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (!error) setCategorias(data)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchCategorias()
  }, [fetchCategorias])

  const addCategoria = async (categoria) => {
    const { error } = await supabase
      .from('categorias')
      .insert([{ ...categoria, user_id: user.id, es_predefinida: false }])
    if (!error) await fetchCategorias()
    return { error }
  }

  const updateCategoria = async (id, cambios) => {
    const { error } = await supabase
      .from('categorias')
      .update(cambios)
      .eq('id', id)
    if (!error) await fetchCategorias()
    return { error }
  }

  const deleteCategoria = async (id) => {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id)
    if (!error) await fetchCategorias()
    return { error }
  }

  return { categorias, loading, addCategoria, updateCategoria, deleteCategoria, refetch: fetchCategorias }
}
