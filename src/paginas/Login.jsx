import '../styles/Auth.css'
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
      navigate('/inicio')
    } else {
      setMensaje(datos.error)
    }
  }

return (
  <div className="auth-screen">
    <aside className="auth-hero">
      <h1 className="auth-hero-mark">FIT<span>TERS</span></h1>
      <p className="auth-hero-tag">
        Registrá tus rutinas y tus días de entrenamiento.
      </p>
      <div className="tape-strip" />
    </aside>

    <main className="auth-panel">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Iniciar sesión</h2>
        <p className="auth-subtitle">Entrá con tu cuenta para ver tus rutinas.</p>

        <div className="field">
          <label htmlFor="email">Correo</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="btn btn-primary" type="submit">Iniciar sesión</button>

        {mensaje && <p className="auth-switch">{mensaje}</p>}
      </form>
    </main>
  </div>
)
}

export default Login