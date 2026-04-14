import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ResearchReport from './pages/ResearchReport.jsx'
import Login from './pages/Login.jsx'
import Settings from './pages/Settings.jsx'
import Compare from './pages/Compare.jsx'
import { useEffect } from 'react'

// Protected route wrapper — redirects to /login if not authenticated
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Public-only route — redirects to / if already logged in
function PublicRoute({ children }) {
  const { user } = useAuth()
  if (user) {
    return <Navigate to="/" replace />
  }
  return children
}

// Apply theme from user settings
function ThemeApplier({ children }) {
  const { user } = useAuth()

  useEffect(() => {
    const theme = user?.settings?.theme || 'dark'
    document.documentElement.setAttribute('data-theme', theme)
  }, [user?.settings?.theme])

  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeApplier>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/report/:id" element={
                  <ProtectedRoute><ResearchReport /></ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute><Settings /></ProtectedRoute>
                } />
                <Route path="/compare" element={
                  <ProtectedRoute><Compare /></ProtectedRoute>
                } />
                <Route path="/login" element={
                  <PublicRoute><Login /></PublicRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </ThemeApplier>
      </AuthProvider>
    </Router>
  )
}

export default App
