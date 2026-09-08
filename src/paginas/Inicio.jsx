import { useNavigate } from 'react-router-dom'
import '../styles/tokens.css'
import '../styles/puente-tokens.css'
import '../styles/inicio.css'

function Inicio() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className="home">
      <header className="home__header">
        <div className="home__brand">FITTERS</div>
        <button className="home__logout" onClick={handleLogout}>Cerrar sesión</button>
      </header>

      <div className="home__grid">
        <button className="home__card home__card--hero" onClick={() => navigate('/progreso')}>
          <span className="home__card-kicker">001 / prioridad</span>
          <span className="home__card-title">Empezar<br/>entreno</span>
          <span className="home__card-desc">Arrancá tu sesión de hoy</span>
          <span className="home__card-arrow">→</span>
        </button>

        <button className="home__card home__card--secondary" onClick={() => navigate('/rutinas')}>
          <span className="home__card-title">Mis rutinas</span>
          <span className="home__card-desc">Ver y editar tus programas</span>
          <span className="home__card-arrow">→</span>
        </button>

        <button className="home__card home__card--secondary" onClick={() => navigate('/ejercicios')}>
          <span className="home__card-title">Catálogo de<br/>ejercicios</span>
          <span className="home__card-desc">Explorar movimientos</span>
          <span className="home__card-arrow">→</span>
        </button>
      </div>
    </div>
  )
}

export default Inicio