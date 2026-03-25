import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📊</span>
          <span className="logo-text">StockAgent</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
