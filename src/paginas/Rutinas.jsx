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
    <div>
      <h1>Mis rutinas</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre de la rutina" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input type="text" placeholder="Día" value={dia} onChange={(e) => setDia(e.target.value)} />
        <button type="submit">Crear rutina</button>
      </form>

      <ul>
        {rutinas.map((rutina) => (
          <li key={rutina.id}>{rutina.nombre} - {rutina.dia}</li>
        ))}
      </ul>
    </div>
  )
}

export default Rutinas