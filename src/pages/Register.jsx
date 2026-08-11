
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

    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-10 animate-fade-in">


      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 animate-scale-in">



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

            className="px-4 py-3 rounded-xl text-base font-medium border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"

          />





          <input

            type="password"

            placeholder="Confirmar contraseña"

            value={confirmar}

            onChange={(e)=>setConfirmar(e.target.value)}

            required

            className="px-4 py-3 rounded-xl text-base font-medium border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"

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

            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] shadow-sm"

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
