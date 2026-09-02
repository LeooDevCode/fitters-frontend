import '../styles/Rutinas.css'
import { useState, useEffect } from 'react'

function Rutinas() {
  const [rutinas, setRutinas] = useState([])
  const [nombre, setNombre] = useState('')
  const [dia, setDia] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    fetch('http://localhost:3001/rutinas', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(respuesta => respuesta.json())
      .then(datos => {
        setRutinas(datos)
        console.log(datos)
      })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    fetch('http://localhost:3001/rutinas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ nombre, dia })
    })
      .then(respuesta => respuesta.json())
      .then(nuevaRutina => {
        setRutinas([...rutinas, nuevaRutina])
        setNombre('')
        setDia('')
      })
  }
return (
  <div className="rutinas-screen">
    <header className="rutinas-header">
      <span className="rutinas-brand">FIT<span>TERS</span></span>
    </header>

    <main className="rutinas-main">
      <section className="rutina-form-panel">
        <h2 className="panel-title">Nueva rutina</h2>
        <form className="rutina-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="nombreRutina">Nombre de la rutina</label>
            <input
              id="nombreRutina"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Pierna, Empuje, Full body"
            />
          </div>

          <div className="field">
            <label htmlFor="diaRutina">Día</label>
            <select id="diaRutina" value={dia} onChange={(e) => setDia(e.target.value)}>
              <option value="">Elegir...</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sábado">Sábado</option>
              <option value="Domingo">Domingo</option>
            </select>
          </div>

          <button className="btn btn-primary" type="submit">Crear rutina</button>
        </form>
      </section>

      <section className="rutinas-list-section">
        <h2 className="panel-title">Tus rutinas</h2>

        {rutinas.length === 0 ? (
          <p className="rutinas-empty">
            Todavía no creaste ninguna rutina. Sumá la primera arriba.
          </p>
        ) : (
          <ul className="rutinas-list">
            {rutinas.map((rutina) => (
              <li className="rutina-card" key={rutina.id}>
                <div className="rutina-card-main">
                  <h3 className="rutina-nombre">{rutina.nombre}</h3>
                  <span className="rutina-dia">{rutina.dia}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  </div>
)
}

export default Rutinas