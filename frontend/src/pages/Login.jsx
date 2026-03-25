import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Connect to Django auth API
    console.log(isRegister ? 'Register' : 'Login', { username, email, password })
    navigate('/')
  }

  return (
    <div className="login-page fade-in" id="login-page">
      <div className="login-card card">
        <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
        <p className="login-subtitle">
          {isRegister
            ? 'Start your AI-powered stock research journey'
            : 'Sign in to your research dashboard'}
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className="input-group">
              <label htmlFor="email-input">Email</label>
              <input
                id="email-input"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" id="auth-submit-btn">
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="toggle-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="toggle-btn"
            onClick={() => setIsRegister(!isRegister)}
            id="toggle-auth-mode"
          >
            {isRegister ? 'Sign In' : 'Create Account'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
