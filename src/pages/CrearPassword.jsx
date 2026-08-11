import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'


export default function CrearPassword() {

  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const {
    setNecesitaPassword
  } = useAuth()



  const guardarPassword = async (e) => {

    e.preventDefault()

    setError('')



    if (password.length < 6) {

      setError(
        'La contraseña debe tener mínimo 6 caracteres.'
      )

      return

    }



    if (password !== confirmarPassword) {

      setError(
        'Las contraseñas no coinciden.'
      )

      return

    }



    setLoading(true)



    const {
      data: {
        user
      }
    } = await supabase.auth.getUser()



    if (!user) {

      setError(
        'No hay sesión activa.'
      )

      setLoading(false)

      return

    }



    const {
      error: updateError
    } = await supabase.auth.updateUser({

      password

    })



    if (updateError) {

      setError(updateError.message)

      setLoading(false)

      return

    }




    const {
      error: profileError
    } =
      await supabase
        .from('profiles')
        .update({

          has_password: true

        })
        .eq(
          'user_id',
          user.id
        )



    if(profileError){

      setError(profileError.message)

      setLoading(false)

      return

    }



    setNecesitaPassword(false)



    navigate('/')

  }





  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-10 animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 animate-scale-in">
        <div className="flex flex-col items-center gap-3 mb-7">
          <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-2xl shadow-lg shadow-brand-900/20">
            🔒
          </span>
        </div>

        <h1 className="text-xl font-bold text-center mb-1.5 text-gray-900 dark:text-gray-100">
          Crea tu contraseña
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-7">
          Configura una contraseña para poder iniciar sesión también con tu correo.
        </p>

        <form onSubmit={guardarPassword} className="flex flex-col gap-3.5">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-xl text-base font-medium border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
            required
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            className="px-4 py-3 rounded-xl text-base font-medium border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
            required
          />

          {error && <p className="text-red-500 dark:text-red-400 text-sm font-semibold">{error}</p>}

          <button
            disabled={loading}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-sm mt-1"
          >
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}
