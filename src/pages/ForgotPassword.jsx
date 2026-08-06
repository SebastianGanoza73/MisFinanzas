import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ForgotPassword() {

  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()


  const enviarCorreo = async (e) => {

    e.preventDefault()

    setMensaje('')
    setError('')
    setLoading(true)


    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`
      }
    )


    setLoading(false)


    if (error) {

      setError(error.message)

      return

    }


    setMensaje(
      'Revisa tu correo. Te enviamos un enlace para cambiar tu contraseña.'
    )

  }



  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">


      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">


        <div className="flex items-center justify-center gap-2 mb-6">

          <span className="text-brand-600 dark:text-brand-400 text-2xl">
            📈
          </span>

          <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
            MisFinanzas
          </span>

        </div>



        <h1 className="text-lg font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
          Recuperar contraseña
        </h1>



        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">

          Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.

        </p>




        <form
          onSubmit={enviarCorreo}
          className="flex flex-col gap-4"
        >


          <input

            type="email"

            placeholder="Correo electrónico"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            required

            className="
            px-3 py-2 rounded-lg text-sm
            border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-brand-500
            "

          />



          {
            error && (

              <p className="text-red-500 text-sm">
                {error}
              </p>

            )
          }



          {
            mensaje && (

              <p className="text-green-600 text-sm">
                {mensaje}
              </p>

            )
          }



          <button

            disabled={loading}

            className="
            bg-brand-600 hover:bg-brand-700
            text-white font-medium
            py-2 rounded-lg
            transition-colors
            disabled:opacity-50
            "

          >

            {
              loading
              ? 'Enviando...'
              : 'Enviar enlace'
            }


          </button>



        </form>




        <button

          onClick={() => navigate('/login')}

          className="
          mt-5 w-full
          text-sm
          text-gray-500
          hover:text-brand-600
          transition-colors
          "

        >

          Volver al inicio de sesión

        </button>



      </div>


    </div>

  )

}
