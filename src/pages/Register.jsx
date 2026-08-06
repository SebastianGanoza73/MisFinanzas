import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function Register(){

  const { signUp } = useAuth()

  const navigate = useNavigate()


  const [nombre,setNombre] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const [mensaje,setMensaje] = useState('')
  const [error,setError] = useState('')



  const crearCuenta = async(e)=>{

    e.preventDefault()

    setError('')
    setMensaje('')


    const {error} = await signUp(
      email,
      password,
      nombre
    )


    if(error){

      setError(error.message)
      return

    }


    setMensaje(
      'Cuenta creada. Revisa tu correo para confirmar.'
    )


  }



  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">


      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow p-8">


        <h1 className="text-xl font-bold text-center mb-6">
          Crear cuenta
        </h1>



        <form
          onSubmit={crearCuenta}
          className="flex flex-col gap-4"
        >


          <input
            placeholder="Nombre"
            value={nombre}
            onChange={e=>setNombre(e.target.value)}
            className="border rounded-lg px-3 py-2"
            required
          />


          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            className="border rounded-lg px-3 py-2"
            required
          />



          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            className="border rounded-lg px-3 py-2"
            required
          />



          {
            error &&
            <p className="text-red-500 text-sm">
              {error}
            </p>
          }


          {
            mensaje &&
            <p className="text-green-600 text-sm">
              {mensaje}
            </p>
          }



          <button
            className="bg-brand-600 text-white py-2 rounded-lg"
          >
            Crear cuenta
          </button>


        </form>



        <button
          onClick={()=>navigate('/login')}
          className="text-sm text-brand-600 mt-4"
        >
          Volver al login
        </button>


      </div>


    </div>

  )

}
