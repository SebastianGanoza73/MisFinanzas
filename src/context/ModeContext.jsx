import { createContext, useContext, useState, useEffect } from 'react'

const ModeContext = createContext()

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('appMode') || 'estandar')

  useEffect(() => {
    localStorage.setItem('appMode', mode)
  }, [mode])

  const toggleMode = () => {
    setMode((prev) => (prev === 'estandar' ? 'lite' : 'estandar'))
  }

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  return useContext(ModeContext)
}
