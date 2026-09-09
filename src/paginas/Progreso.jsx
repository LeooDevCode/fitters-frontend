import { useState, useEffect, useRef } from 'react'
import '../styles/tokens.css'
import '../styles/puente-tokens.css'
import '../styles/progreso.css'

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
    return () => clearInterval(intervaloRef.current)
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
              cargasIniciales[ej.id] = {
                series: ej.series,
                repeticiones: ej.repeticiones,
                peso: ej.peso,
                hecho: false,
                editando: false
              }
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
    for (let i = 1; i < 104; i++) {
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
    <div className="progress-screen">

      <section className="streak">
        <div className="streak__header">
          <span className="streak__label">Racha</span>
          <span className="streak__count">{racha} <small>{racha === 1 ? 'semana' : 'semanas'}</small></span>
        </div>
        <div className="streak__scroller">
          <div className="streak__grid">
            {dias.map((dia) => (
              <span
                key={dia.fecha}
                className={`streak__day ${dia.entrenado ? 'streak__day--done' : ''}`}
                title={dia.fecha}
              />
            ))}
          </div>
        </div>
      </section>

      {!sesionActiva && !resumen && (
        <section className="routine-select">
          <h1 className="routine-select__title">Elegí tu rutina</h1>
          <ul className="routine-select__list">
            {rutinas.map((r) => (
              <li className="routine-card" key={r.id}>
                <div className="routine-card__info">
                  <span className="routine-card__name">{r.nombre}</span>
                  <span className="routine-card__meta">{r.dia || 'Rutina'}</span>
                </div>
                <button className="routine-card__start" onClick={() => empezarEntreno(r)}>
                  Empezar
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {sesionActiva && (
        <section className="session">
          <header className="session__header">
            <span className="session__routine-name">{rutinaActiva.nombre}</span>
            <span className="session__timer">{formatearTiempo(segundos)}</span>
          </header>

          <ul className="session__list">
            {ejerciciosSesion.map((ej) => {
              const carga = cargas[ej.id] || {}
              return (
                <li className={`session__exercise ${carga.hecho ? 'session__exercise--done' : ''}`} key={ej.id}>
                  <div className="session__exercise-main">
                    <span className="session__exercise-name">{ej.nombre}</span>

                    {carga.editando ? (
                      <div className="session__edit-fields">
                        <input className="session__edit-input" type="number" aria-label="Series" value={carga.series || ''} onChange={(e) => actualizarCarga(ej.id, 'series', e.target.value)} />
                        <input className="session__edit-input" type="number" aria-label="Repeticiones" value={carga.repeticiones || ''} onChange={(e) => actualizarCarga(ej.id, 'repeticiones', e.target.value)} />
                        <input className="session__edit-input" type="number" aria-label="Peso en libras" value={carga.peso || ''} onChange={(e) => actualizarCarga(ej.id, 'peso', e.target.value)} />
                      </div>
                    ) : (
                      <span className="session__exercise-plan">{carga.series || 0} x {carga.repeticiones || 0} — {carga.peso || 0} lb</span>
                    )}
                  </div>

                  <div className="session__exercise-actions">
                    {!carga.hecho && (
                      <button className="session__edit-btn" onClick={() => actualizarCarga(ej.id, 'editando', !carga.editando)}>
                        {carga.editando ? 'Listo' : 'Editar'}
                      </button>
                    )}
                    <button
                      className={`session__check-btn ${carga.hecho ? 'session__check-btn--active' : ''}`}
                      onClick={() => carga.hecho ? actualizarCarga(ej.id, 'hecho', false) : guardarEjercicio(ej)}
                    >
                      ✓
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>

          <button className="session__finish-btn" onClick={terminarEntreno}>Terminar entreno</button>
        </section>
      )}

      {resumen && (
        <section className="summary">
          <h1 className="summary__title">Entreno terminado</h1>
          <div className="summary__stats">
            <div className="summary__stat">
              <span className="summary__stat-value">{formatearTiempo(resumen.duracion)}</span>
              <span className="summary__stat-label">Duración</span>
            </div>
            <div className="summary__stat">
              <span className="summary__stat-value">{resumen.ejerciciosHechos}/{resumen.totalEjercicios}</span>
              <span className="summary__stat-label">Completados</span>
            </div>
          </div>
          <div className="summary__muscles">
            {resumen.grupos.map((g) => (
              <span className="summary__muscle-tag" key={g}>{g}</span>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}

export default Progreso