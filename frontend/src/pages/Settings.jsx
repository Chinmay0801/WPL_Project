import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Settings.css'

function Settings() {
  const { user, updateProfile, changePassword, deleteAccount, updateSettings, logout } = useAuth()
  const navigate = useNavigate()

  // Profile state
  const [username] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [avatar, setAvatar] = useState(user?.avatar || '')

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  // Messages
  const [profileMsg, setProfileMsg] = useState(null)
  const [passwordMsg, setPasswordMsg] = useState(null)

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleProfileSave = (e) => {
    e.preventDefault()
    updateProfile({ email, bio, avatar })
    setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
    setTimeout(() => setProfileMsg(null), 3000)
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters' })
      return
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' })
      return
    }
    const result = changePassword(currentPassword, newPassword)
    if (result.success) {
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } else {
      setPasswordMsg({ type: 'error', text: result.error })
    }
    setTimeout(() => setPasswordMsg(null), 4000)
  }

  const handleDeleteAccount = () => {
    deleteAccount()
    navigate('/login')
  }

  const handleThemeToggle = () => {
    const newTheme = user.settings?.theme === 'dark' ? 'light' : 'dark'
    updateSettings({ theme: newTheme })
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="settings-page fade-in" id="settings-page">
      <header className="settings-header">
        <h1>⚙️ Settings</h1>
        <p className="settings-subtitle">Manage your account, preferences, and security</p>
      </header>

      {/* Profile Section */}
      <section className="settings-section card-static" id="profile-settings">
        <div className="section-header">
          <h2>👤 Profile</h2>
          <span className="section-desc">Update your personal information</span>
        </div>
        <form onSubmit={handleProfileSave} className="settings-form">
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="settings-username">Username</label>
              <input
                id="settings-username"
                type="text"
                className="input-field"
                value={username}
                disabled
                title="Username cannot be changed"
              />
              <span className="input-hint">Username cannot be changed</span>
            </div>
            <div className="input-group">
              <label htmlFor="settings-email">Email</label>
              <input
                id="settings-email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="settings-avatar">Avatar URL</label>
            <input
              id="settings-avatar"
              type="url"
              className="input-field"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <div className="input-group">
            <label htmlFor="settings-bio">Bio</label>
            <textarea
              id="settings-bio"
              className="input-field"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
          {profileMsg && (
            <div className={`settings-msg settings-msg-${profileMsg.type}`}>
              {profileMsg.type === 'success' ? '✅' : '❌'} {profileMsg.text}
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" id="save-profile-btn">
              💾 Save Profile
            </button>
          </div>
        </form>
      </section>

      {/* Change Password */}
      <section className="settings-section card-static" id="password-settings">
        <div className="section-header">
          <h2>🔒 Change Password</h2>
          <span className="section-desc">Keep your account secure</span>
        </div>
        <form onSubmit={handlePasswordChange} className="settings-form">
          <div className="input-group">
            <label htmlFor="current-password">Current Password</label>
            <input
              id="current-password"
              type="password"
              className="input-field"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                className="input-field"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirm-new-password">Confirm New Password</label>
              <input
                id="confirm-new-password"
                type="password"
                className="input-field"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          {passwordMsg && (
            <div className={`settings-msg settings-msg-${passwordMsg.type}`}>
              {passwordMsg.type === 'success' ? '✅' : '❌'} {passwordMsg.text}
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" id="change-password-btn">
              🔑 Update Password
            </button>
          </div>
        </form>
      </section>

      {/* Appearance */}
      <section className="settings-section card-static" id="appearance-settings">
        <div className="section-header">
          <h2>🎨 Appearance</h2>
          <span className="section-desc">Customize how the app looks</span>
        </div>
        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-label">Dark Mode</span>
            <span className="toggle-desc">Toggle between dark and light theme</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={user.settings?.theme === 'dark'}
              onChange={handleThemeToggle}
              id="theme-toggle"
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </section>

      {/* Notifications */}
      <section className="settings-section card-static" id="notification-settings">
        <div className="section-header">
          <h2>🔔 Notifications</h2>
          <span className="section-desc">Control what notifications you receive</span>
        </div>
        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-label">Email Notifications</span>
            <span className="toggle-desc">Receive email updates about your research</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={user.settings?.emailNotifications ?? true}
              onChange={(e) => updateSettings({ emailNotifications: e.target.checked })}
              id="email-notifications-toggle"
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-label">Research Alerts</span>
            <span className="toggle-desc">Get notified when a research report completes</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={user.settings?.researchAlerts ?? true}
              onChange={(e) => updateSettings({ researchAlerts: e.target.checked })}
              id="research-alerts-toggle"
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-label">Weekly Digest</span>
            <span className="toggle-desc">Receive a weekly summary of market insights</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={user.settings?.weeklyDigest ?? false}
              onChange={(e) => updateSettings({ weeklyDigest: e.target.checked })}
              id="weekly-digest-toggle"
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </section>

      {/* Account Info */}
      <section className="settings-section card-static" id="account-info">
        <div className="section-header">
          <h2>📋 Account Info</h2>
          <span className="section-desc">Your account details</span>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Username</span>
            <span className="info-value">{user.username}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Member Since</span>
            <span className="info-value">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Session */}
      <section className="settings-section card-static" id="session-settings">
        <div className="section-header">
          <h2>🚪 Session</h2>
          <span className="section-desc">Manage your current session</span>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout} id="logout-btn">
          🚪 Sign Out
        </button>
      </section>

      {/* Danger Zone */}
      <section className="settings-section settings-danger card-static" id="danger-zone">
        <div className="section-header">
          <h2>⚠️ Danger Zone</h2>
          <span className="section-desc">Irreversible actions — proceed with caution</span>
        </div>
        <div className="danger-content">
          <div className="danger-info">
            <p className="danger-title">Delete Account</p>
            <p className="danger-desc">Permanently delete your account and all research data. This action cannot be undone.</p>
          </div>
          <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)} id="delete-account-btn">
            🗑️ Delete Account
          </button>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Delete Account?</h3>
            <p>
              This will permanently delete your account, all research reports, and saved preferences.
              This action is <strong>irreversible</strong>.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteAccount} id="confirm-delete-btn">
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
