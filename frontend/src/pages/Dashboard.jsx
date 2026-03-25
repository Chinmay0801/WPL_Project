import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const [query, setQuery] = useState('')
  const [ticker, setTicker] = useState('')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)

  const handleNewResearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/research/reports/', {
        ticker_symbol: ticker || undefined,
        query: query,
      })
      setReports([response.data, ...reports])
      setQuery('')
      setTicker('')
    } catch (error) {
      console.error('Failed to create research:', error)
    }
    setLoading(false)
  }

  return (
    <div className="dashboard fade-in" id="dashboard-page">
      <header className="dashboard-header">
        <h1>Research Dashboard</h1>
        <p className="subtitle">Launch AI-powered stock analysis with autonomous agents</p>
      </header>

      {/* New Research Form */}
      <section className="card new-research" id="new-research-form">
        <h2>🚀 New Research</h2>
        <form onSubmit={handleNewResearch} className="research-form">
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="ticker-input">Stock Ticker (optional)</label>
              <input
                id="ticker-input"
                type="text"
                className="input-field"
                placeholder="e.g. AAPL"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
              />
            </div>
            <div className="input-group" style={{ flex: 2 }}>
              <label htmlFor="query-input">Research Query</label>
              <input
                id="query-input"
                type="text"
                className="input-field"
                placeholder='e.g. "Analyze tech stocks with high dividend yields"'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} id="start-research-btn">
            {loading ? 'Starting...' : '⚡ Start Research'}
          </button>
        </form>
      </section>

      {/* Reports List */}
      <section className="reports-section">
        <h2>Recent Reports</h2>
        {reports.length === 0 ? (
          <div className="empty-state card">
            <p>No research reports yet. Start a new analysis above!</p>
          </div>
        ) : (
          <div className="reports-grid">
            {reports.map((report) => (
              <Link to={`/report/${report.id}`} key={report.id} className="report-card card">
                <div className="report-card-header">
                  <span className="report-ticker">{report.ticker_symbol || '🔍'}</span>
                  <span className={`badge badge-${report.status.replace('_', '-')}`}>
                    {report.status}
                  </span>
                </div>
                <p className="report-query">{report.query}</p>
                <span className="report-date">
                  {new Date(report.created_at).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
