import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isRegister) {
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }
      const result = register(username, email, password)
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error)
      }
    } else {
      const result = login(username, password)
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error)
      }
    }

    setLoading(false)
  }

  return (
    <div className="login-page fade-in" id="login-page">
      <div className="login-card card-static">
        <div className="login-brand">
          <span className="login-brand-icon">📊</span>
          <span className="login-brand-name">StockAgent</span>
        </div>
        <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
        <p className="login-subtitle">
          {isRegister
            ? 'Start your AI-powered stock research journey'
            : 'Sign in to your research dashboard'}
        </p>

        {error && (
          <div className="login-error" id="auth-error">
            <span>❌</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              type="text"
              className="input-field"
              placeholder="Enter your username"
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
                placeholder="you@example.com"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className="input-group">
              <label htmlFor="confirm-password-input">Confirm Password</label>
              <input
                id="confirm-password-input"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading} id="auth-submit-btn">
            {loading ? (
              <><span className="spinner"></span> Processing...</>
            ) : (
              isRegister ? '🚀 Create Account' : '⚡ Sign In'
            )}
          </button>
        </form>

        <p className="toggle-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="toggle-btn"
            onClick={() => { setIsRegister(!isRegister); setError('') }}
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
