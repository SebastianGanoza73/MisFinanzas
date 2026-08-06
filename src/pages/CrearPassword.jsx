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

    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">


      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow p-8">


        <h1 className="text-xl font-bold text-center mb-3">
          Crear contraseña
        </h1>



        <p className="text-sm text-gray-500 text-center mb-6">
          Configura una contraseña para tu cuenta.
        </p>



        <form
          onSubmit={guardarPassword}
          className="flex flex-col gap-4"
        >


          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="border rounded-lg px-3 py-2"
            required
          />



          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarPassword}
            onChange={(e)=>setConfirmarPassword(e.target.value)}
            className="border rounded-lg px-3 py-2"
            required
          />



          {
            error && (

              <p className="text-red-500 text-sm">
                {error}
              </p>

            )
          }




          <button
            disabled={loading}
            className="bg-brand-600 text-white py-2 rounded-lg"
          >

            {
              loading
              ? 'Guardando...'
              : 'Guardar contraseña'
            }

          </button>


        </form>


      </div>


    </div>

  )

}
