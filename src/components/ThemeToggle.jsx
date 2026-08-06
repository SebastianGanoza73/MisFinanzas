import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'


export default function ThemeToggle() {


  const {
    theme,
    changeTheme
  } = useTheme()



  const [open, setOpen] = useState(false)





  const options = [

    {
      id: 'light',
      label: 'Claro',
      icon: '☀️'
    },

    {
      id: 'dark',
      label: 'Oscuro',
      icon: '🌙'
    },

    {
      id: 'system',
      label: 'Sistema',
      icon: '📱'
    }

  ]







  const current = options.find(
    option => option.id === theme
  )







  return (

    <div className="relative">


      <button

        onClick={() => setOpen(!open)}

        aria-label="Cambiar tema"

        className="
        flex items-center gap-1.5
        text-sm font-medium
        text-gray-700 dark:text-gray-200
        bg-gray-100 hover:bg-gray-200
        dark:bg-gray-800 dark:hover:bg-gray-700
        px-2.5 sm:px-3
        py-2
        rounded-lg
        transition-colors
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-brand-500
        "

      >

        <span>
          {current?.icon}
        </span>


        <span className="hidden sm:inline">
          Tema
        </span>


      </button>







      {
        open && (

          <div

            className="
            absolute
            right-0
            mt-2
            w-40
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-800
            rounded-xl
            shadow-lg
            p-1
            z-50
            "

          >


            {
              options.map(option => (


                <button

                  key={option.id}

                  onClick={() => {

                    changeTheme(option.id)

                    setOpen(false)

                  }}


                  className={`

                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2
                  rounded-lg
                  text-sm
                  transition-colors

                  ${
                    theme === option.id

                    ? 
                    'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'

                    :

                    'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'

                  }

                  `}

                >

                  <span>
                    {option.icon}
                  </span>


                  <span>
                    {option.label}
                  </span>


                </button>


              ))

            }



          </div>

        )

      }



    </div>

  )

}
