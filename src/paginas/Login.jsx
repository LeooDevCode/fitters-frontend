import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const respuesta = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const datos = await respuesta.json()

    if (respuesta.ok) {
      localStorage.setItem('token', datos.token)
      setMensaje('Login exitoso')
      navigate('/rutinas')
    } else {
      setMensaje(datos.error)
    }
  }

  return (
    <div>
      <h1>Iniciar sesion</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Iniciar sesion</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  )
}

export default Login