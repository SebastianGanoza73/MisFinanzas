import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()


export function ThemeProvider({ children }) {


  const getSystemTheme = () => {

    return window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
      ? 'dark'
      : 'light'

  }




  const [theme, setTheme] = useState(() => {


    const saved =
      localStorage.getItem('theme')


    return saved || getSystemTheme()


  })





  useEffect(() => {


    const root =
      document.documentElement



    if(theme === 'dark') {

      root.classList.add('dark')

    } else {

      root.classList.remove('dark')

    }



    localStorage.setItem(
      'theme',
      theme
    )


  }, [theme])







  useEffect(() => {


    const media =
      window.matchMedia(
        '(prefers-color-scheme: dark)'
      )



    const listener = (event)=>{


      const saved =
        localStorage.getItem('theme')



      // Solo cambia automático
      // si el usuario nunca eligió manualmente

      if(!saved){

        setTheme(
          event.matches
            ? 'dark'
            : 'light'
        )

      }


    }



    media.addEventListener(
      'change',
      listener
    )



    return ()=>{

      media.removeEventListener(
        'change',
        listener
      )

    }


  }, [])







  const toggleTheme = ()=>{


    setTheme(
      prev =>
        prev === 'dark'
          ? 'light'
          : 'dark'
    )


  }







  return (

    <ThemeContext.Provider

      value={{
        theme,
        toggleTheme
      }}

    >

      {children}

    </ThemeContext.Provider>

  )

}






export function useTheme(){

  return useContext(ThemeContext)

}
