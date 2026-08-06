import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const {
    signIn,
    signInWithGoogle
  } = useAuth()


  const navigate = useNavigate()



  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')
    setLoading(true)



    const {
      error
    } = await signIn(
      email,
      password
    )



    setLoading(false)



    if (error) {

      setError(
        'Correo o contraseña incorrectos.'
      )

      return

    }



    navigate('/')

  }





  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">


      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">



        <div className="flex items-center gap-2 mb-6 justify-center">

          <span className="text-brand-600 dark:text-brand-400 text-2xl">
            📈
          </span>

          <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
            MisFinanzas
          </span>

        </div>





        <h1 className="text-lg font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
          Bienvenido
        </h1>



        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          Ingresa con Google o con tu correo electrónico.
        </p>






        <button

          onClick={signInWithGoogle}

          type="button"

          className="
          w-full flex items-center justify-center gap-2
          border border-gray-200 dark:border-gray-700
          rounded-lg py-2
          text-sm font-medium
          text-gray-700 dark:text-gray-200
          hover:bg-gray-50 dark:hover:bg-gray-800
          transition-colors mb-6
          "

        >


          <svg width="18" height="18" viewBox="0 0 48 48">

            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.5-.4-3.5z"/>

            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3c-7.4 0-13.8 4.1-17.7 10.1z"/>

            <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36.4 26.7 37 24 37c-5.2 0-9.6-3.3-11.2-8l-6.5 5C10.1 40.7 16.5 45 24 45z"/>

            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.6l6.2 5.2C40.6 36.3 44 31 44 24c0-1.4-.2-2.5-.4-3.5z"/>

          </svg>


          Continuar con Google


        </button>







        <div className="flex items-center gap-3 mb-5">

          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />

          <span className="text-xs text-gray-400">
            o inicia sesión
          </span>

          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />

        </div>







        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >



          <input

            type="email"

            autoComplete="email"

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





          <input

            type="password"

            autoComplete="current-password"

            placeholder="Contraseña"

            value={password}

            onChange={(e)=>setPassword(e.target.value)}

            required

            className="
            px-3 py-2 rounded-lg text-sm
            border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-brand-500
            "

          />






          <div className="text-right">

            <button

              type="button"

              onClick={() => navigate('/forgot-password')}

              className="
              text-xs
              text-brand-600 dark:text-brand-400
              hover:underline
              "

            >

              ¿Olvidaste tu contraseña?

            </button>

          </div>






          {
            error && (

              <p className="text-red-500 text-sm">
                {error}
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
              ? 'Cargando...'
              : 'Iniciar sesión'
            }


          </button>



        </form>






        <div className="mt-5 text-center">


          <span className="text-sm text-gray-500 dark:text-gray-400">
            ¿No tienes una cuenta?
          </span>



          <button

            onClick={() => navigate('/register')}

            className="
            ml-1
            text-sm font-medium
            text-brand-600 dark:text-brand-400
            hover:underline
            "

          >

            Crear cuenta

          </button>


        </div>




      </div>


    </div>

  )

}
