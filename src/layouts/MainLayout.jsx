import { useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

export default function MainLayout({ children }) {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar: solo visible en desktop (sm+). En mobile la navegación
          vive en BottomNav, ya no hay drawer de hamburguesa. */}
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        {/* key={pathname} fuerza a React a remontar el <main> en cada
            cambio de ruta, así la animación de entrada se dispara cada
            vez en vez de solo la primera carga. pb-24 en mobile deja
            espacio para que el BottomNav fijo no tape el contenido. */}
        <main key={location.pathname} className="flex-1 p-4 sm:p-6 pb-24 sm:pb-6 animate-page-in">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
