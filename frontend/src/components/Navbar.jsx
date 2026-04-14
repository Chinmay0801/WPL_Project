import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const getInitial = () => {
    if (user?.avatar) return null
    return user?.username?.charAt(0).toUpperCase() || '?'
  }

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📊</span>
          <span className="logo-text">StockAgent</span>
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link
                to="/"
                className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}
              >
                Dashboard
              </Link>
              <Link
                to="/settings"
                className={`nav-link ${isActive('/settings') ? 'nav-link-active' : ''}`}
              >
                Settings
              </Link>

              <div className="navbar-user">
                <div className="user-avatar" title={user.username}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="avatar-img" />
                  ) : (
                    <span className="avatar-initial">{getInitial()}</span>
                  )}
                </div>
                <button
                  className="nav-link nav-logout"
                  onClick={() => {
                    logout()
                    window.location.href = '/login'
                  }}
                  id="navbar-logout-btn"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className={`nav-link ${isActive('/login') ? 'nav-link-active' : ''}`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
