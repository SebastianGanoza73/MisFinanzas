// Pantalla de bienvenida propia de la app: reemplaza el "Cargando..." plano
// que se mostraba mientras se verifica la sesión. Vive dentro de React, así
// que respeta el modo oscuro/claro (a diferencia del splash nativo del
// sistema operativo al abrir la PWA, que se genera antes de que cargue
// nuestro CSS y no podemos animar).
export default function SplashScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 dark:from-brand-950 dark:via-brand-900 dark:to-gray-950 overflow-hidden relative">
      {/* Blobs decorativos, sutiles */}
      <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-splash-blob" />
      <div className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-splash-blob" style={{ animationDelay: '1.2s' }} />

      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-black/10 animate-splash-pop">
          <span className="text-4xl">📈</span>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-white tracking-tight animate-splash-fade" style={{ animationDelay: '0.15s' }}>
          ¡Bienvenido a MisFinanzas!
        </h1>
        <p className="mt-2 text-sm font-medium text-brand-100 animate-splash-fade" style={{ animationDelay: '0.3s' }}>
          Ordenando tus números para que tomes mejores decisiones ✨
        </p>

        <div className="mt-8 flex items-center gap-1.5 animate-splash-fade" style={{ animationDelay: '0.45s' }}>
          <span className="w-2 h-2 rounded-full bg-white/80 animate-splash-dot" />
          <span className="w-2 h-2 rounded-full bg-white/80 animate-splash-dot" style={{ animationDelay: '0.15s' }} />
          <span className="w-2 h-2 rounded-full bg-white/80 animate-splash-dot" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  )
}
