import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import Auth from './pages/Auth'
import Inicio from './pages/Inicio'
import Historial from './pages/Historial'
import ResumenSemanal from './pages/ResumenSemanal'
import BalanceMensual from './pages/BalanceMensual'
import MetasAhorro from './pages/MetasAhorro'
import ExportarExcel from './pages/ExportarExcel'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/historial" element={<Historial />} />
                <Route path="/resumen-semanal" element={<ResumenSemanal />} />
                <Route path="/balance-mensual" element={<BalanceMensual />} />
                <Route path="/metas-ahorro" element={<MetasAhorro />} />
                <Route path="/exportar" element={<ExportarExcel />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App