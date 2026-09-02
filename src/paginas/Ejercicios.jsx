import { useState, useEffect } from 'react'
import '../styles/Rutinas.css'

function Ejercicios() {
  const [ejercicios, setEjercicios] = useState([])
  const [nombre, setNombre] = useState('')
  const [grupoMuscular, setGrupoMuscular] = useState('')
  const [descripcion, setDescripcion] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    fetch('http://localhost:3001/ejercicios', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(respuesta => respuesta.json())
      .then(datos => setEjercicios(datos))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    fetch('http://localhost:3001/ejercicios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ nombre, grupo_muscular: grupoMuscular, descripcion })
    })
      .then(respuesta => respuesta.json())
      .then(nuevoEjercicio => {
        setEjercicios([...ejercicios, nuevoEjercicio])
        setNombre('')
        setGrupoMuscular('')
        setDescripcion('')
      })
  }

  return (
    <div className="rutinas-screen">
      <header className="rutinas-header">
        <span className="rutinas-brand">FIT<span>TERS</span></span>
      </header>

      <main className="rutinas-main">
        <section className="rutina-form-panel">
          <h2 className="panel-title">Nuevo ejercicio</h2>
          <form className="rutina-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="nombreEjercicio">Nombre</label>
              <input id="nombreEjercicio" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Press banca" />
            </div>

            <div className="field">
              <label htmlFor="grupoMuscular">Grupo muscular</label>
              <input id="grupoMuscular" value={grupoMuscular} onChange={(e) => setGrupoMuscular(e.target.value)} placeholder="Ej: Pecho" />
            </div>

            <div className="field">
              <label htmlFor="descripcion">Descripción</label>
              <input id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Opcional" />
            </div>

            <button className="btn btn-primary" type="submit">Crear ejercicio</button>
          </form>
        </section>

        <section className="rutinas-list-section">
          <h2 className="panel-title">Catálogo de ejercicios</h2>

          {ejercicios.length === 0 ? (
            <p className="rutinas-empty">Todavía no hay ejercicios cargados.</p>
          ) : (
            <ul className="rutinas-list">
              {ejercicios.map((ej) => (
                <li className="rutina-card" key={ej.id}>
                  <div className="rutina-card-main">
                    <h3 className="rutina-nombre">{ej.nombre}</h3>
                    <span className="rutina-dia">{ej.grupo_muscular}</span>
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

export default Ejercicios