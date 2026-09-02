import '../styles/Auth.css'
import { useState } from 'react'

function Registro() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const respuesta = await fetch('http://localhost:3001/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    })

    const datos = await respuesta.json()

    if (respuesta.ok) {
      setMensaje('Cuenta creada correctamente')
    } else {
      setMensaje(datos.error)
    }
  }
return (
  <div className="auth-screen">
    <aside className="auth-hero">
      <h1 className="auth-hero-mark">FIT<span>TERS</span></h1>
      <p className="auth-hero-tag">
        Creá tu cuenta y armá tu primera rutina en un par de minutos.
      </p>
      <div className="tape-strip" />
    </aside>

    <main className="auth-panel">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Crear cuenta</h2>
        <p className="auth-subtitle">Sumate para empezar a entrenar con orden.</p>

        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="email">Correo</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="btn btn-primary" type="submit">Crear cuenta</button>

        {mensaje && <p className="auth-switch">{mensaje}</p>}
      </form>
    </main>
  </div>
)
  
}

export default Registro