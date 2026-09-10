import { useState, useEffect } from 'react'
import '../styles/Rutinas.css'

function Ejercicios() {
  const [ejercicios, setEjercicios] = useState([])
  const [nombre, setNombre] = useState('')
  const [grupoMuscular, setGrupoMuscular] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [filtroGrupo, setFiltroGrupo] = useState('')

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

  const eliminarEjercicio = (id) => {
    const confirmar = window.confirm('¿Eliminar este ejercicio del catálogo? Si está usado en alguna rutina, podría fallar.')
    if (!confirmar) return

    const token = localStorage.getItem('token')

    fetch(`http://localhost:3001/ejercicios/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(respuesta => {
        if (!respuesta.ok) throw new Error('No se pudo eliminar')
        return respuesta.json()
      })
      .then(() => {
        setEjercicios(ejercicios.filter(ej => ej.id !== id))
      })
      .catch(error => {
        console.error(error)
        alert('No se pudo eliminar el ejercicio (puede estar en uso en alguna rutina).')
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
          <form className="rutina-form ejercicio-form" onSubmit={handleSubmit}>
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
          <select
            value={filtroGrupo}
            onChange={(e) => setFiltroGrupo(e.target.value)}
            style={{ marginBottom: '1rem' }}
          >
            <option value="">Todos los grupos</option>
            <option value="Pecho">Pecho</option>
            <option value="Espalda">Espalda</option>
            <option value="Piernas">Piernas</option>
            <option value="Biceps">Biceps</option>
            <option value="Triceps">Triceps</option>
            <option value="Hombros">Hombros</option>
            <option value="Abdomen">Abdomen</option>
          </select>

          {ejercicios.length === 0 ? (
            <p className="rutinas-empty">Todavía no hay ejercicios cargados.</p>
          ) : (
            <ul className="catalogo-grid">
              {ejercicios
                .filter((ej) => filtroGrupo === '' || ej.grupo_muscular === filtroGrupo)
                .map((ej) => (
                  <li className="ejercicio-ficha" key={ej.id}>
                    <h3 className="rutina-nombre">{ej.nombre}</h3>
                    <div className="ejercicio-ficha-footer">
                      <span className="grupo-badge">{ej.grupo_muscular}</span>
                      <button className="btn-eliminar" onClick={() => eliminarEjercicio(ej.id)}>
                        Eliminar
                      </button>
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