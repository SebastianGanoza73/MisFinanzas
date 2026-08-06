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

          🌐

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
