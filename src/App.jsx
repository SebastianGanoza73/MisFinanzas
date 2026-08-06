import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useMode } from './context/ModeContext'

import MainLayout from './layouts/MainLayout'

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

    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
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

    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
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






export default function App() {

  return (

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

  )

}
