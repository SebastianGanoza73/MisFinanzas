import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

const MINUTOS_INACTIVIDAD = 2
const SEGUNDOS_AVISO_PREVIO = 20


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [necesitaPassword, setNecesitaPassword] = useState(false)

  const [mostrarAviso, setMostrarAviso] = useState(false)

  const avisoTimeoutRef = useRef(null)
  const logoutTimeoutRef = useRef(null)



  const verificarPasswordGoogle = async (usuario) => {

    const { data, error } = await supabase
      .from('profiles')
      .select('has_password, provider')
      .eq('user_id', usuario.id)
      .maybeSingle()



    if (error) {

      console.error(
        'Error buscando perfil:',
        error
      )

      return

    }



    // Si no existe perfil, lo crea

    if (!data) {

      const { error: insertError } =
        await supabase
          .from('profiles')
          .insert({

            user_id: usuario.id,
            email: usuario.email,
            display_name: usuario.user_metadata?.full_name || '',
            provider: 'google',
            has_password: false

          })



      if (insertError) {

        console.error(
          'Error creando perfil:',
          insertError
        )

        return

      }



      setNecesitaPassword(true)

      return

    }




    if (
      data.provider === 'google' &&
      data.has_password === false
    ) {

      setNecesitaPassword(true)

    } else {

      setNecesitaPassword(false)

    }

  }





  const signOut = async () => {

    setMostrarAviso(false)
    setNecesitaPassword(false)

    return supabase.auth.signOut()

  }





  const limpiarTemporizadores = () => {

    if (avisoTimeoutRef.current)
      clearTimeout(avisoTimeoutRef.current)


    if (logoutTimeoutRef.current)
      clearTimeout(logoutTimeoutRef.current)

  }





  const reiniciarTemporizador = () => {

    limpiarTemporizadores()

    setMostrarAviso(false)



    const total =
      MINUTOS_INACTIVIDAD * 60 * 1000



    const aviso =
      total - SEGUNDOS_AVISO_PREVIO * 1000



    avisoTimeoutRef.current =
      setTimeout(() => {

        setMostrarAviso(true)

      }, aviso)




    logoutTimeoutRef.current =
      setTimeout(() => {

        signOut()

      }, total)

  }





  const continuarSesion = () => {

    reiniciarTemporizador()

  }





  useEffect(() => {


    const cargarSesion = async () => {


      const {
        data: {
          session
        }
      } = await supabase.auth.getSession()



      const usuario =
        session?.user ?? null



      setUser(usuario)



      if (usuario) {

        await verificarPasswordGoogle(usuario)

      }



      setLoading(false)


    }




    cargarSesion()



    const {
      data: listener
    } =
      supabase.auth.onAuthStateChange(
        async (_event, session) => {


          const usuario =
            session?.user ?? null



          setUser(usuario)



          if (usuario) {

            await verificarPasswordGoogle(usuario)

          }


        }
      )



    return () =>
      listener.subscription.unsubscribe()



  }, [])





  useEffect(() => {


    if (!user) {

      limpiarTemporizadores()
      setMostrarAviso(false)

      return

    }




    reiniciarTemporizador()



    const eventos = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll'
    ]



    const actividad = () => {

      if (!mostrarAviso) {

        reiniciarTemporizador()

      }

    }



    eventos.forEach(evento => {

      window.addEventListener(
        evento,
        actividad
      )

    })



    return () => {


      eventos.forEach(evento => {

        window.removeEventListener(
          evento,
          actividad
        )

      })



      limpiarTemporizadores()


    }



  }, [user])







  const signUp = (email, password, displayName) =>
  supabase.auth.signUp({

    email,
    password,

    options: {
      data: {
        display_name: displayName
      }
    }

  })





  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({

      email,
      password

    })





  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({

      provider: 'google'

    })







  return (

    <AuthContext.Provider

      value={{

        user,
        loading,

        necesitaPassword,
        setNecesitaPassword,

        signUp,
        signIn,
        signInWithGoogle,
        signOut

      }}

    >

      {children}



      {
        mostrarAviso && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4">

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6">


              <h2 className="font-bold">
                ¿Sigues ahí?
              </h2>



              <p className="text-sm text-gray-500 mb-4">
                Tu sesión se cerrará pronto.
              </p>



              <div className="flex gap-2">


                <button
                  onClick={signOut}
                  className="border rounded-lg px-4 py-2"
                >
                  Cerrar sesión
                </button>



                <button
                  onClick={continuarSesion}
                  className="bg-brand-600 text-white rounded-lg px-4 py-2"
                >
                  Sigo aquí
                </button>


              </div>


            </div>


          </div>

        )
      }



    </AuthContext.Provider>

  )

}





export function useAuth() {

  return useContext(AuthContext)

}
