import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function hashPassword(password) {
  // Simple hash for localStorage demo — NOT for production
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash.toString(36)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('current_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('current_user')
      }
    }
    setLoading(false)
  }, [])

  // Persist user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('current_user', JSON.stringify(user))
      // Also update in users registry
      const users = JSON.parse(localStorage.getItem('registered_users') || '{}')
      users[user.username.toLowerCase()] = { ...users[user.username.toLowerCase()], ...user }
      localStorage.setItem('registered_users', JSON.stringify(users))
    }
  }, [user])

  function register(username, email, password) {
    const users = JSON.parse(localStorage.getItem('registered_users') || '{}')
    const key = username.toLowerCase()

    if (users[key]) {
      return { success: false, error: 'Username already taken' }
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      bio: '',
      avatar: '',
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      settings: {
        theme: 'dark',
        emailNotifications: true,
        researchAlerts: true,
        weeklyDigest: false,
      },
    }

    users[key] = newUser
    localStorage.setItem('registered_users', JSON.stringify(users))
    setUser(newUser)
    return { success: true }
  }

  function login(username, password) {
    const users = JSON.parse(localStorage.getItem('registered_users') || '{}')
    const key = username.toLowerCase()
    const found = users[key]

    if (!found) {
      return { success: false, error: 'User not found. Please register first.' }
    }

    if (found.passwordHash !== hashPassword(password)) {
      return { success: false, error: 'Incorrect password' }
    }

    setUser(found)
    return { success: true }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('current_user')
  }

  function updateProfile(updates) {
    const updated = { ...user, ...updates }
    setUser(updated)
    return { success: true }
  }

  function changePassword(currentPassword, newPassword) {
    if (hashPassword(currentPassword) !== user.passwordHash) {
      return { success: false, error: 'Current password is incorrect' }
    }
    const updated = { ...user, passwordHash: hashPassword(newPassword) }
    setUser(updated)
    return { success: true }
  }

  function deleteAccount() {
    const users = JSON.parse(localStorage.getItem('registered_users') || '{}')
    delete users[user.username.toLowerCase()]
    localStorage.setItem('registered_users', JSON.stringify(users))
    // Clean up reports
    localStorage.removeItem(`reports_${user.id}`)
    logout()
  }

  function updateSettings(newSettings) {
    const updated = {
      ...user,
      settings: { ...user.settings, ...newSettings },
    }
    setUser(updated)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    updateSettings,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthContext
