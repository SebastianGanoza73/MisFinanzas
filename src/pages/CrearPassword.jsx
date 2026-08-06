import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CrearPassword() {

  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()



  const guardarPassword = async (e) => {
    e.preventDefault()

    setError('')


    if (password.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres.')
      return
    }


    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }


    setLoading(true)



    // Obtener usuario actual
    const {
      data: { user }
    } = await supabase.auth.getUser()



    if (!user) {
      setError('No hay sesión activa.')
      setLoading(false)
      return
    }



    // Crear contraseña en Supabase Auth
    const { error: passwordError } =
      await supabase.auth.updateUser({
        password
      })



    if (passwordError) {
      setError(passwordError.message)
      setLoading(false)
      return
    }



    // Actualizar perfil
    const { error: profileError } =
      await supabase
        .from('profiles')
        .update({
          has_password: true
        })
        .eq('user_id', user.id)



    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }



    navigate('/')

  }




  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">

      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">


        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100 mb-3">
          Crear contraseña
        </h1>


        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          Ahora podrás iniciar sesión con Google o con correo y contraseña.
        </p>



        <form
          onSubmit={guardarPassword}
          className="flex flex-col gap-4"
        >


          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
            required
          />



          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
            required
          />



          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}



          <button
            disabled={loading}
            className="bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>


        </form>


      </div>


    </div>

  )

}
