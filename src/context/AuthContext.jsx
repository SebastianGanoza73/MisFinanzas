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
      .single()

    if (error) {
      console.error('Error revisando perfil:', error)
      return
    }

    if (data.provider === 'google' && !data.has_password) {
      setNecesitaPassword(true)
    } else {
      setNecesitaPassword(false)
    }
  }


  const signOut = () => {
    setMostrarAviso(false)
    setNecesitaPassword(false)
    return supabase.auth.signOut()
  }


  const limpiarTemporizadores = () => {
    if (avisoTimeoutRef.current) clearTimeout(avisoTimeoutRef.current)
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current)
  }


  const reiniciarTemporizador = () => {
    limpiarTemporizadores()
    setMostrarAviso(false)

    const msTotal = MINUTOS_INACTIVIDAD * 60 * 1000
    const msAviso = msTotal - SEGUNDOS_AVISO_PREVIO * 1000

    avisoTimeoutRef.current = setTimeout(() => {
      setMostrarAviso(true)
    }, msAviso)


    logoutTimeoutRef.current = setTimeout(() => {
      signOut()
    }, msTotal)
  }


  const continuarSesion = () => {
    reiniciarTemporizador()
  }


  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const usuario = session?.user ?? null

      setUser(usuario)

      if (usuario) {
        await verificarPasswordGoogle(usuario)
      }

      setLoading(false)
    })


    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const usuario = session?.user ?? null

        setUser(usuario)

        if (usuario) {
          await verificarPasswordGoogle(usuario)
        }
      }
    )


    return () => listener.subscription.unsubscribe()

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


    const manejarActividad = () => {
      if (!mostrarAviso) {
        reiniciarTemporizador()
      }
    }


    eventos.forEach((evento) =>
      window.addEventListener(evento, manejarActividad)
    )


    return () => {
      eventos.forEach((evento) =>
        window.removeEventListener(evento, manejarActividad)
      )

      limpiarTemporizadores()
    }

  }, [user])



  const signUp = (email, password) =>
    supabase.auth.signUp({
      email,
      password
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
        signUp,
        signIn,
        signInWithGoogle,
        signOut
      }}
    >

      {children}


      {mostrarAviso && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4">

          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 text-center">

            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              ¿Sigues ahí?
            </h2>


            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Tu sesión se cerrará en {SEGUNDOS_AVISO_PREVIO} segundos por inactividad.
            </p>


            <div className="flex gap-2">

              <button
                onClick={signOut}
                className="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cerrar sesión
              </button>


              <button
                onClick={continuarSesion}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors"
              >
                Sigo aquí
              </button>

            </div>

          </div>

        </div>
      )}

    </AuthContext.Provider>
  )
}



export function useAuth() {
  return useContext(AuthContext)
}
