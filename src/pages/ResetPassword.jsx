
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {

  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()



  const cambiarPassword = async (e) => {

    e.preventDefault()

    setError('')



    if(password.length < 6){

      setError(
        'La contraseña debe tener mínimo 6 caracteres.'
      )

      return

    }



    if(password !== confirmar){

      setError(
        'Las contraseñas no coinciden.'
      )

      return

    }



    setLoading(true)



    const {
      error
    } = await supabase.auth.updateUser({

      password

    })



    setLoading(false)



    if(error){

      setError(error.message)
      return

    }



    navigate('/')

  }





  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">


      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">



        <h1 className="text-xl font-bold text-center mb-3 text-gray-900 dark:text-gray-100">

          Nueva contraseña

        </h1>




        <p className="text-sm text-center text-gray-500 mb-6">

          Escribe tu nueva contraseña.

        </p>





        <form
          onSubmit={cambiarPassword}
          className="flex flex-col gap-4"
        >



          <input

            type="password"

            placeholder="Nueva contraseña"

            value={password}

            onChange={(e)=>setPassword(e.target.value)}

            required

            className="px-3 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"

          />





          <input

            type="password"

            placeholder="Confirmar contraseña"

            value={confirmar}

            onChange={(e)=>setConfirmar(e.target.value)}

            required

            className="px-3 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"

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
              : 'Cambiar contraseña'
            }

          </button>



        </form>


      </div>


    </div>

  )

}
