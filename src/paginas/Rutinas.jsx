import { useState, useEffect } from 'react'
import '../styles/Rutinas.css'

function Rutinas() {
  const [rutinas, setRutinas] = useState([])
  const [nombre, setNombre] = useState('')
  const [dia, setDia] = useState('')

  const [rutinaAbierta, setRutinaAbierta] = useState(null)
  const [ejerciciosDeRutina, setEjerciciosDeRutina] = useState([])
  const [catalogoEjercicios, setCatalogoEjercicios] = useState([])
  const [ejercicioId, setEjercicioId] = useState('')
  const [series, setSeries] = useState('')
  const [repeticiones, setRepeticiones] = useState('')
  const [peso, setPeso] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    fetch('http://localhost:3001/rutinas', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(respuesta => respuesta.json())
      .then(datos => setRutinas(datos))

    fetch('http://localhost:3001/ejercicios', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(respuesta => respuesta.json())
      .then(datos => setCatalogoEjercicios(datos))
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

  const abrirRutina = (rutinaId) => {
    if (rutinaAbierta === rutinaId) {
      setRutinaAbierta(null)
      return
    }

    setRutinaAbierta(rutinaId)
    const token = localStorage.getItem('token')

    fetch(`http://localhost:3001/rutinas/${rutinaId}/ejercicios`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(respuesta => respuesta.json())
      .then(datos => setEjerciciosDeRutina(datos.ejercicios))
  }

  const handleAgregarEjercicio = (e, rutinaId) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    fetch(`http://localhost:3001/rutinas/${rutinaId}/ejercicios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        ejercicio_id: ejercicioId,
        series,
        repeticiones,
        peso
      })
    })
      .then(respuesta => respuesta.json())
      .then(nuevo => {
        setEjerciciosDeRutina([...ejerciciosDeRutina, nuevo])
        setEjercicioId('')
        setSeries('')
        setRepeticiones('')
        setPeso('')
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

                  <button
                    className="rutina-toggle"
                    aria-expanded={rutinaAbierta === rutina.id}
                    onClick={() => abrirRutina(rutina.id)}
                  >
                    {rutinaAbierta === rutina.id ? '–' : '+'}
                  </button>

                  <div className="rutina-card-expand" hidden={rutinaAbierta !== rutina.id}>
                    {ejerciciosDeRutina.length === 0 ? (
                      <p className="rutina-expand-placeholder">Sin ejercicios todavía.</p>
                    ) : (
                      ejerciciosDeRutina.map((ej) => (
                        <div className="ejercicio-row" key={ej.id}>
                          <span>{ej.nombre}</span>
                          <span>{ej.series} series</span>
                          <span>{ej.repeticiones} reps</span>
                          <span>{ej.peso} lb</span>
                        </div>
                      ))
                    )}

                    <form
                      className="rutina-form"
                      style={{ marginTop: '1rem' }}
                      onSubmit={(e) => handleAgregarEjercicio(e, rutina.id)}
                    >
                      <div className="field">
                        <label>Ejercicio</label>
                        <select value={ejercicioId} onChange={(e) => setEjercicioId(e.target.value)} required>
                          <option value="">Elegir...</option>
                          {catalogoEjercicios.map((ej) => (
                            <option key={ej.id} value={ej.id}>{ej.nombre}</option>
                          ))}
                        </select>
                      </div>

                      <div className="field">
                        <label>Series</label>
                        <input type="number" value={series} onChange={(e) => setSeries(e.target.value)} required />
                      </div>

                      <div className="field">
                        <label>Repeticiones</label>
                        <input type="number" value={repeticiones} onChange={(e) => setRepeticiones(e.target.value)} required />
                      </div>

                      <div className="field">
                        <label>Peso (lb)</label>
                        <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} required />
                      </div>

                      <button className="btn btn-primary" type="submit">Agregar</button>
                    </form>
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