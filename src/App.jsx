import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useMode } from './context/ModeContext'

import MainLayout from './layouts/MainLayout'
import SplashScreen from './components/SplashScreen'
import InstallPwaButton from './components/InstallPwaButton'

import Auth from './pages/Auth'
import Register from './pages/Register'
import CrearPassword from './pages/CrearPassword'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

import Inicio from './pages/Inicio'
import Historial from './pages/Historial'
import ResumenSemanal from './pages/ResumenSemanal'
import BalanceMensual from './pages/BalanceMensual'
import MetasAhorro from './pages/MetasAhorro'
import ExportarExcel from './pages/ExportarExcel'
import ModoLite from './pages/ModoLite'



function ProtectedRoute({ children }) {

  const {
    user,
    loading,
    necesitaPassword
  } = useAuth()



  if (loading) {

    // Este caso ya casi nunca ocurre (el arranque de la app espera a que
    // la sesión esté lista antes de mostrar rutas), pero se deja un
    // indicador liviano como respaldo. La pantalla grande de bienvenida
    // ("¡Bienvenido a MisFinanzas!") solo debe verse una vez, al abrir la
    // app por primera vez — nunca después de iniciar sesión.
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <span className="w-8 h-8 rounded-full border-[3px] border-brand-200 dark:border-brand-900 border-t-brand-600 dark:border-t-brand-400 animate-spin" />
      </div>
    )

  }



  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )

  }



  if (necesitaPassword) {

    return (
      <Navigate
        to="/crear-password"
        replace
      />
    )

  }



  return children

}





function AuthenticatedRoute({ children }) {

  const {
    user,
    loading
  } = useAuth()



  if (loading) {

    // Mismo respaldo liviano que en ProtectedRoute — ver comentario arriba.
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <span className="w-8 h-8 rounded-full border-[3px] border-brand-200 dark:border-brand-900 border-t-brand-600 dark:border-t-brand-400 animate-spin" />
      </div>
    )

  }



  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )

  }



  return children

}






function AppShell() {

  const {
    mode
  } = useMode()



  if (mode === 'lite') {

    return <ModoLite />

  }



  return (

    <MainLayout>

      <Routes>

        <Route
          path="/"
          element={<Inicio />}
        />


        <Route
          path="/historial"
          element={<Historial />}
        />


        <Route
          path="/resumen-semanal"
          element={<ResumenSemanal />}
        />


        <Route
          path="/balance-mensual"
          element={<BalanceMensual />}
        />


        <Route
          path="/metas-ahorro"
          element={<MetasAhorro />}
        />


        <Route
          path="/exportar"
          element={<ExportarExcel />}
        />

      </Routes>


    </MainLayout>

  )

}






// Duración mínima (ms) que se mantiene visible la pantalla de bienvenida al
// abrir la app, para que el texto se alcance a leer aunque la sesión cargue
// rápido en una red buena.
const SPLASH_MIN_MS = 2200

export default function App() {

  const { loading: authLoading } = useAuth()
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), SPLASH_MIN_MS)
    return () => clearTimeout(timer)
  }, [])

  // El splash se queda visible hasta que se cumplan AMBAS condiciones: el
  // tiempo mínimo de lectura y la verificación de sesión. Una vez que las
  // dos se cumplen, ninguna vuelve a "true" durante esta sesión del
  // navegador — por eso "¡Bienvenido a MisFinanzas!" solo aparece una vez
  // al abrir la app, y nunca se repite después de iniciar sesión o
  // registrarse.
  if (!minTimeElapsed || authLoading) {

    return <SplashScreen />

  }

  return (

    <>

    <Routes>


      {/* Login */}
      <Route
        path="/login"
        element={<Auth />}
      />



      {/* Registro */}
      <Route
        path="/register"
        element={<Register />}
      />



      {/* Crear contraseña después de Google */}
      <Route
        path="/crear-password"
        element={
          <AuthenticatedRoute>
            <CrearPassword />
          </AuthenticatedRoute>
        }
      />



      {/* Recuperar contraseña */}
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />



      {/* Crear nueva contraseña desde correo */}
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />



      {/* Aplicación */}
      <Route
        path="/*"
        element={

          <ProtectedRoute>

            <AppShell />

          </ProtectedRoute>

        }
      />


    </Routes>

    {/* Botón "Instalar aplicación": global, para que esté disponible
        tanto en las pantallas de login/registro como dentro de la app.
        Se oculta solo (ver InstallPwaButton) en desktop, si el
        navegador no ofrece instalación, o si ya está instalada. */}
    <InstallPwaButton />

    </>

  )

}
