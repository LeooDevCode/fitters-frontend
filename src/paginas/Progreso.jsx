import { useState, useEffect, useRef } from 'react'
import '../styles/Rutinas.css'

function Progreso() {
  const [rutinas, setRutinas] = useState([])
  const [registros, setRegistros] = useState([])

  const [sesionActiva, setSesionActiva] = useState(null)
  const [rutinaActiva, setRutinaActiva] = useState(null)
  const [ejerciciosSesion, setEjerciciosSesion] = useState([])
  const [segundos, setSegundos] = useState(0)
  const intervaloRef = useRef(null)

  const [cargas, setCargas] = useState({})
  const [resumen, setResumen] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:3001/rutinas', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(r => r.json())
      .then(datos => setRutinas(datos))

    cargarRegistros()
  }, [])

  const cargarRegistros = () => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:3001/registros', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(r => r.json())
      .then(datos => setRegistros(datos))
  }

  const empezarEntreno = (rutina) => {
    const token = localStorage.getItem('token')

    fetch('http://localhost:3001/sesiones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ rutina_id: rutina.id })
    })
      .then(r => r.json())
      .then(sesion => {
        setSesionActiva(sesion)
        setRutinaActiva(rutina)
        setResumen(null)
        setSegundos(0)

        fetch(`http://localhost:3001/rutinas/${rutina.id}/ejercicios`, {
          headers: { 'Authorization': 'Bearer ' + token }
        })
          .then(r => r.json())
          .then(datos => {
            setEjerciciosSesion(datos.ejercicios)
            const cargasIniciales = {}
            datos.ejercicios.forEach((ej) => {
              cargasIniciales[ej.id] = { series: '', repeticiones: '', peso: '', hecho: false }
            })
            setCargas(cargasIniciales)
          })

        intervaloRef.current = setInterval(() => {
          setSegundos((s) => s + 1)
        }, 1000)
      })
  }

  const actualizarCarga = (ejId, campo, valor) => {
    setCargas((prev) => ({
      ...prev,
      [ejId]: { ...prev[ejId], [campo]: valor }
    }))
  }

  const guardarEjercicio = (ej) => {
    const token = localStorage.getItem('token')
    const datosCarga = cargas[ej.id]
    const hoy = new Date().toISOString().slice(0, 10)

    fetch('http://localhost:3001/registros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        ejercicio_id: ej.ejercicio_id,
        rutina_id: rutinaActiva.id,
        sesion_id: sesionActiva.id,
        fecha: hoy,
        series: datosCarga.series,
        repeticiones: datosCarga.repeticiones,
        peso: datosCarga.peso
      })
    })
      .then(r => r.json())
      .then(() => {
        setCargas((prev) => ({
          ...prev,
          [ej.id]: { ...prev[ej.id], hecho: true }
        }))
      })
  }

  const formatearTiempo = (totalSegundos) => {
    const min = Math.floor(totalSegundos / 60)
    const seg = totalSegundos % 60
    return `${min}:${seg.toString().padStart(2, '0')}`
  }

  const terminarEntreno = () => {
    clearInterval(intervaloRef.current)
    const token = localStorage.getItem('token')

    fetch(`http://localhost:3001/sesiones/${sesionActiva.id}/finalizar`, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(r => r.json())
      .then((sesionFinal) => {
        const gruposTrabajados = [...new Set(ejerciciosSesion.map((ej) => ej.grupo_muscular))]
        const seriesHechas = Object.values(cargas).filter((c) => c.hecho).length

        setResumen({
          duracion: sesionFinal.duracion_segundos,
          ejerciciosHechos: seriesHechas,
          totalEjercicios: ejerciciosSesion.length,
          grupos: gruposTrabajados
        })

        setSesionActiva(null)
        setRutinaActiva(null)
        setEjerciciosSesion([])
        cargarRegistros()
      })
  }

  useEffect(() => {
    return () => clearInterval(intervaloRef.current)
  }, [])

  const fechasEntrenadas = new Set(registros.map((r) => r.fecha.slice(0, 10)))

  const generarDiasDelAnio = () => {
    const dias = []
    const hoy = new Date()
    const inicio = new Date(hoy)
    inicio.setDate(hoy.getDate() - 371)
    for (let d = new Date(inicio); d <= hoy; d.setDate(d.getDate() + 1)) {
      const clave = d.toISOString().slice(0, 10)
      dias.push({ fecha: clave, entrenado: fechasEntrenadas.has(clave) })
    }
    return dias
  }

  const dias = generarDiasDelAnio()
  const semanas = []
  let semanaActual = []
  dias.forEach((dia) => {
    semanaActual.push(dia)
    if (semanaActual.length === 7) {
      semanas.push(semanaActual)
      semanaActual = []
    }
  })
  if (semanaActual.length > 0) semanas.push(semanaActual)

  const calcularRachaSemanal = () => {
    let racha = 0
    const hoy = new Date()
    for (let i = 0; i < 104; i++) {
      const finSemana = new Date(hoy)
      finSemana.setDate(hoy.getDate() - i * 7)
      const inicioSemana = new Date(finSemana)
      inicioSemana.setDate(finSemana.getDate() - 6)
      let entrenoEsaSemana = false
      for (let d = new Date(inicioSemana); d <= finSemana; d.setDate(d.getDate() + 1)) {
        if (fechasEntrenadas.has(d.toISOString().slice(0, 10))) {
          entrenoEsaSemana = true
          break
        }
      }
      if (entrenoEsaSemana) racha++
      else break
    }
    return racha
  }

  const racha = calcularRachaSemanal()

  return (
    <div className="rutinas-screen">
      <header className="rutinas-header">
        <span className="rutinas-brand">FIT<span>TERS</span></span>
      </header>

      <main className="rutinas-main">

        {!sesionActiva && !resumen && (
          <section className="rutina-form-panel">
            <h2 className="panel-title">Empezar entreno</h2>
            <ul className="rutinas-list">
              {rutinas.map((r) => (
                <li className="rutina-card" key={r.id}>
                  <div className="rutina-card-main">
                    <h3 className="rutina-nombre">{r.nombre}</h3>
                    <span className="rutina-dia">{r.dia}</span>
                  </div>
                  <button className="btn btn-primary" style={{ margin: '1rem' }} onClick={() => empezarEntreno(r)}>
                    Empezar
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {sesionActiva && (
          <section className="rutina-form-panel">
            <h2 className="panel-title">{rutinaActiva.nombre} — {formatearTiempo(segundos)}</h2>

            {ejerciciosSesion.map((ej) => (
              <div className="ejercicio-row" key={ej.id} style={{ opacity: cargas[ej.id]?.hecho ? 0.5 : 1 }}>
                <span>{ej.nombre}</span>
                <div className="edit-campo">
                  <label>Series</label>
                  <input type="number" value={cargas[ej.id]?.series || ''} onChange={(e) => actualizarCarga(ej.id, 'series', e.target.value)} />
                </div>
                <div className="edit-campo">
                  <label>Reps</label>
                  <input type="number" value={cargas[ej.id]?.repeticiones || ''} onChange={(e) => actualizarCarga(ej.id, 'repeticiones', e.target.value)} />
                </div>
                <div className="edit-campo">
                  <label>Lb</label>
                  <input type="number" value={cargas[ej.id]?.peso || ''} onChange={(e) => actualizarCarga(ej.id, 'peso', e.target.value)} />
                </div>
                <button className="btn btn-ghost rutina-toggle-editar" onClick={() => guardarEjercicio(ej)}>
                  {cargas[ej.id]?.hecho ? '✓ Hecho' : 'Guardar'}
                </button>
              </div>
            ))}

            <button className="btn btn-primary" style={{ marginTop: '1.25rem', width: '100%' }} onClick={terminarEntreno}>
              Terminar entreno
            </button>
          </section>
        )}

        {resumen && (
          <section className="rutina-form-panel">
            <h2 className="panel-title">Entreno terminado</h2>
            <p className="rutina-expand-placeholder">
              Duración: {formatearTiempo(resumen.duracion)}<br />
              Ejercicios completados: {resumen.ejerciciosHechos} / {resumen.totalEjercicios}<br />
              Músculos trabajados: {resumen.grupos.join(', ')}
            </p>
            <button className="btn btn-primary" onClick={() => setResumen(null)}>Cerrar</button>
          </section>
        )}

        <section className="rutina-form-panel">
          <h2 className="panel-title">
            Racha: {racha} {racha === 1 ? 'semana' : 'semanas'} seguidas entrenando
          </h2>
          <div className="calendario-github">
            {semanas.map((semana, i) => (
              <div className="calendario-columna" key={i}>
                {semana.map((dia) => (
                  <div key={dia.fecha} className={`calendario-dia ${dia.entrenado ? 'calendario-dia-activo' : ''}`} title={dia.fecha} />
                ))}
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}

export default Progreso