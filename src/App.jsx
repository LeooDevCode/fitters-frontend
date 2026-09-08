import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Rutinas from './paginas/Rutinas'
import RutaProtegida from './RutaProtegida'
import Ejercicios from './paginas/Ejercicios'
import Progreso from './paginas/Progreso'
import Inicio from './paginas/Inicio'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/rutinas" element={<RutaProtegida><Rutinas /></RutaProtegida>} />
        <Route path="/ejercicios" element={<RutaProtegida><Ejercicios /></RutaProtegida>} />
        <Route path="/progreso" element={<RutaProtegida><Progreso /></RutaProtegida>} />
        <Route path="/inicio" element={<RutaProtegida><Inicio /></RutaProtegida>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App