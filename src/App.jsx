import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Rutinas from './paginas/Rutinas'
import RutaProtegida from './RutaProtegida'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/rutinas" element={<RutaProtegida><Rutinas /></RutaProtegida>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App