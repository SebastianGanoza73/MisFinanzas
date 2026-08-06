import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()



function getSystemTheme() {

  return window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches
    ? 'dark'
    : 'light'

}





export function ThemeProvider({ children }) {


  const [theme, setTheme] = useState(() => {


    const saved =
      localStorage.getItem('themePreference')


    return saved || 'system'


  })






  const applyTheme = (selectedTheme) => {


    const root =
      document.documentElement



    let finalTheme = selectedTheme



    if(selectedTheme === 'system') {

      finalTheme = getSystemTheme()

    }



    if(finalTheme === 'dark') {

      root.classList.add('dark')

    } else {

      root.classList.remove('dark')

    }


  }







  useEffect(() => {


    applyTheme(theme)



    localStorage.setItem(
      'themePreference',
      theme
    )


  }, [theme])









  useEffect(() => {


    const media =
      window.matchMedia(
        '(prefers-color-scheme: dark)'
      )




    const handleSystemChange = () => {


      if(theme === 'system') {

        applyTheme('system')

      }


    }





    media.addEventListener(
      'change',
      handleSystemChange
    )





    return () => {


      media.removeEventListener(
        'change',
        handleSystemChange
      )


    }



  }, [theme])









  const changeTheme = (newTheme) => {


    setTheme(newTheme)


  }







  return (

    <ThemeContext.Provider

      value={{
        theme,
        changeTheme
      }}

    >

      {children}

    </ThemeContext.Provider>

  )


}








export function useTheme() {

  return useContext(ThemeContext)

}
