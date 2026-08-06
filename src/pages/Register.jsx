import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {

  const { signUp } = useAuth()
  const navigate = useNavigate()


  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const [correoEnviado, setCorreoEnviado] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState(false)



  const crearCuenta = async (e) => {

    e.preventDefault()

    setError('')
    setEmailEnviado(false)
    setLoading(true)



    const { error } = await signUp(
      email,
      password,
      nombre
    )



    setLoading(false)



    if (error) {

      if (
        error.message.includes('already registered') ||
        error.message.includes('already exists')
      ) {

        setError(
          'Este correo ya está registrado.'
        )

      } else {

        setError(
          'No se pudo crear la cuenta. Inténtalo nuevamente.'
        )

      }


      return

    }



    // Guardamos el correo antes de limpiar
    setCorreoEnviado(email)



    // Limpiamos formulario
    setNombre('')
    setEmail('')
    setPassword('')



    // Mostramos pantalla de confirmación
    setEmailEnviado(true)


  }





  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-50
      dark:bg-gray-950
      px-4
    ">


      <div className="
        w-full
        max-w-sm
        bg-white
        dark:bg-gray-900
        rounded-xl
        shadow-sm
        border
        border-gray-200
        dark:border-gray-800
        p-8
      ">



        {
          emailEnviado ? (


            <div className="text-center">


              <div className="
                w-20
                h-20
                mx-auto
                mb-6
                rounded-full
                bg-brand-100
                dark:bg-brand-900/30
                flex
                items-center
                justify-center
                text-4xl
              ">

                📧

              </div>



              <h2 className="
                text-2xl
                font-bold
                text-gray-900
                dark:text-gray-100
                mb-3
              ">

                Revisa tu correo

              </h2>




              <p className="
                text-gray-500
                dark:text-gray-400
              ">

                Hemos enviado un enlace de confirmación a:

              </p>




              <p className="
                mt-2
                font-semibold
                text-brand-600
                dark:text-brand-400
                break-all
              ">

                {correoEnviado}

              </p>





              <p className="
                mt-5
                text-sm
                leading-6
                text-gray-500
                dark:text-gray-400
              ">

                Revisa tu bandeja de entrada y haz clic en el enlace de confirmación para activar tu cuenta.

              </p>




              <p className="
                mt-2
                text-sm
                text-gray-500
                dark:text-gray-400
              ">

                Después podrás iniciar sesión normalmente.

              </p>





              <button

                onClick={() => navigate('/login')}

                className="
                  w-full
                  mt-8
                  bg-brand-600
                  hover:bg-brand-700
                  text-white
                  font-medium
                  py-2.5
                  rounded-lg
                  transition-colors
                "

              >

                Ir al inicio de sesión


              </button>



            </div>



          ) : (


            <>


              <h1 className="
                text-2xl
                font-bold
                text-center
                text-gray-900
                dark:text-gray-100
                mb-2
              ">

                Crear cuenta

              </h1>




              <p className="
                text-sm
                text-center
                text-gray-500
                dark:text-gray-400
                mb-6
              ">

                Crea tu cuenta para comenzar a administrar tus finanzas.

              </p>





              <form

                onSubmit={crearCuenta}

                className="
                  flex
                  flex-col
                  gap-4
                "

              >





                <input

                  type="text"

                  placeholder="Nombre"

                  value={nombre}

                  onChange={(e)=>setNombre(e.target.value)}

                  required

                  className="
                    w-full
                    px-3
                    py-2
                    rounded-lg
                    border
                    border-gray-300
                    dark:border-gray-700
                    bg-white
                    dark:bg-gray-800
                    text-gray-900
                    dark:text-gray-100
                    focus:outline-none
                    focus:ring-2
                    focus:ring-brand-500
                  "

                />





                <input

                  type="email"

                  placeholder="Correo electrónico"

                  value={email}

                  onChange={(e)=>setEmail(e.target.value)}

                  required

                  className="
                    w-full
                    px-3
                    py-2
                    rounded-lg
                    border
                    border-gray-300
                    dark:border-gray-700
                    bg-white
                    dark:bg-gray-800
                    text-gray-900
                    dark:text-gray-100
                    focus:outline-none
                    focus:ring-2
                    focus:ring-brand-500
                  "

                />






                <input

                  type="password"

                  placeholder="Contraseña (mínimo 6 caracteres)"

                  value={password}

                  onChange={(e)=>setPassword(e.target.value)}

                  minLength={6}

                  required

                  className="
                    w-full
                    px-3
                    py-2
                    rounded-lg
                    border
                    border-gray-300
                    dark:border-gray-700
                    bg-white
                    dark:bg-gray-800
                    text-gray-900
                    dark:text-gray-100
                    focus:outline-none
                    focus:ring-2
                    focus:ring-brand-500
                  "

                />







                {
                  error && (

                    <div className="
                      rounded-lg
                      bg-red-50
                      dark:bg-red-900/20
                      border
                      border-red-200
                      dark:border-red-800
                      p-3
                    ">

                      <p className="
                        text-sm
                        text-red-600
                        dark:text-red-400
                      ">

                        {error}

                      </p>


                    </div>

                  )
                }







                <button

                  type="submit"

                  disabled={loading}

                  className="
                    w-full
                    bg-brand-600
                    hover:bg-brand-700
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    text-white
                    font-medium
                    py-2.5
                    rounded-lg
                    transition-colors
                  "

                >

                  {
                    loading
                    ? 'Creando cuenta...'
                    : 'Crear cuenta'
                  }


                </button>



              </form>






              <button

                onClick={() => navigate('/login')}

                className="
                  w-full
                  mt-5
                  text-sm
                  text-brand-600
                  dark:text-brand-400
                  hover:underline
                "

              >

                ¿Ya tienes una cuenta? Inicia sesión


              </button>



            </>

          )

        }



      </div>


    </div>

  )

}
