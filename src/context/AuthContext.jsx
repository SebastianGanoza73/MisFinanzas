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

    console.log("Revisando usuario:", usuario.email)


    const { data, error } = await supabase
      .from('profiles')
      .select('has_password, provider')
      .eq('user_id', usuario.id)
      .maybeSingle()



    console.log("Perfil encontrado:", data)



    if (error) {

      console.error(
        "Error buscando profile:",
        error
      )

      return

    }



    if (!data) {

      console.log("No existe profile, creando...")


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
          "Error creando profile:",
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

      console.log(
        "USUARIO NECESITA PASSWORD"
      )


      setNecesitaPassword(true)


    } else {


      console.log(
        "USUARIO NORMAL"
      )


      setNecesitaPassword(false)

    }

  }





  const signOut = () => {

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


    avisoTimeoutRef.current =
      setTimeout(() => {

        setMostrarAviso(true)

      }, total - SEGUNDOS_AVISO_PREVIO * 1000)



    logoutTimeoutRef.current =
      setTimeout(() => {

        signOut()

      }, total)

  }





  const continuarSesion = () => {

    reiniciarTemporizador()

  }





  useEffect(() => {


    const iniciar = async () => {


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



    iniciar()



    const {
      data: listener
    } = supabase.auth.onAuthStateChange(
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

      if (!mostrarAviso)
        reiniciarTemporizador()

    }



    eventos.forEach(e =>
      window.addEventListener(
        e,
        actividad
      )
    )



    return () => {

      eventos.forEach(e =>
        window.removeEventListener(
          e,
          actividad
        )
      )


      limpiarTemporizadores()

    }



  }, [user])





  const signUp = (email,password) =>
    supabase.auth.signUp({
      email,
      password
    })



  const signIn = (email,password) =>
    supabase.auth.signInWithPassword({
      email,
      password
    })



  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider:'google'
    })





  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        necesitaPassword,
        signUp,
        signIn,
        signInWithGoogle,
        signOut
      }}
    >

      {children}


      {mostrarAviso && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6">

            <h2 className="font-bold">
              ¿Sigues ahí?
            </h2>

            <button onClick={signOut}>
              Cerrar sesión
            </button>

            <button onClick={continuarSesion}>
              Sigo aquí
            </button>

          </div>

        </div>

      )}


    </AuthContext.Provider>

  )

}



export function useAuth(){

  return useContext(AuthContext)

}
