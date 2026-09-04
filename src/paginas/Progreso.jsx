import { useState, useEffect } from 'react'
import '../styles/Rutinas.css'

function Progreso() {
  const [rutinas, setRutinas] = useState([])
  const [rutinaId, setRutinaId] = useState('')
  const [ejerciciosDeRutina, setEjerciciosDeRutina] = useState([])
  const [ejercicioId, setEjercicioId] = useState('')
  const [series, setSeries] = useState('')
  const [repeticiones, setRepeticiones] = useState('')
  const [peso, setPeso] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:3001/rutinas', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(respuesta => respuesta.json())
      .then(datos => setRutinas(datos))
  }, [])

  const elegirRutina = (id) => {
    setRutinaId(id)
    setEjercicioId('')
    if (!id) {
      setEjerciciosDeRutina([])
      return
    }
    const token = localStorage.getItem('token')
    fetch(`http://localhost:3001/rutinas/${id}/ejercicios`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(respuesta => respuesta.json())
      .then(datos => setEjerciciosDeRutina(datos.ejercicios))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const hoy = new Date().toISOString().slice(0, 10)

    fetch('http://localhost:3001/registros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        ejercicio_id: ejercicioId,
        rutina_id: rutinaId,
        fecha: hoy,
        series,
        repeticiones,
        peso
      })
    })
      .then(respuesta => respuesta.json())
      .then(() => {
        setMensaje('Registrado')
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
          <h2 className="panel-title">Registrar entreno de hoy</h2>
           <form className="rutina-form progreso-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Rutina</label>
              <select value={rutinaId} onChange={(e) => elegirRutina(e.target.value)} required>
                <option value="">Elegir...</option>
                {rutinas.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Ejercicio</label>
              <select value={ejercicioId} onChange={(e) => setEjercicioId(e.target.value)} required>
                <option value="">Elegir...</option>
                {ejerciciosDeRutina.map((ej) => (
                 <option key={ej.id} value={ej.ejercicio_id}>{ej.nombre}</option>
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

            <button className="btn btn-primary" type="submit">Registrar</button>
          </form>
          {mensaje && <p className="rutina-expand-placeholder">{mensaje}</p>}
        </section>
      </main>
    </div>
  )
}

export default Progreso