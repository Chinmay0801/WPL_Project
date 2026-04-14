import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ToastContainer, useToast } from '../components/Toast'
import './Dashboard.css'

// ─── Mock Research Data Generator ────────────────────────────────────────
export function generateMockReport(ticker, query) {
  const companies = {
    AAPL: { name: 'Apple Inc.', sector: 'Technology', price: 198.45, pe: 32.1, high52: 237.23, low52: 164.08, diff1d: '+1.2%', diff1w: '+3.4%', mcap: '3.08T' },
    MSFT: { name: 'Microsoft Corp.', sector: 'Technology', price: 428.50, pe: 37.8, high52: 468.35, low52: 309.45, diff1d: '-0.5%', diff1w: '+1.8%', mcap: '3.18T' },
    GOOGL: { name: 'Alphabet Inc.', sector: 'Technology', price: 175.20, pe: 26.4, high52: 191.75, low52: 120.21, diff1d: '+2.1%', diff1w: '+4.0%', mcap: '2.17T' },
    AMZN: { name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', price: 192.80, pe: 62.3, high52: 201.20, low52: 118.35, diff1d: '+0.8%', diff1w: '-1.2%', mcap: '2.01T' },
    TSLA: { name: 'Tesla Inc.', sector: 'Automotive', price: 248.90, pe: 72.5, high52: 299.29, low52: 138.80, diff1d: '-2.4%', diff1w: '-5.6%', mcap: '792B' },
    NVDA: { name: 'NVIDIA Corp.', sector: 'Technology', price: 875.30, pe: 68.2, high52: 974.00, low52: 298.06, diff1d: '+4.5%', diff1w: '+12.4%', mcap: '2.31T' },
    TCS: { name: 'Tata Consultancy Services', sector: 'Technology', price: 3950.20, pe: 30.5, high52: 4200.00, low52: 3100.00, diff1d: '+0.5%', diff1w: '+1.2%', mcap: '14.5T INR' },
    INFY: { name: 'Infosys Ltd.', sector: 'Technology', price: 1480.50, pe: 24.2, high52: 1730.00, low52: 1215.00, diff1d: '-1.2%', diff1w: '-0.8%', mcap: '6.1T INR' },
    RELIANCE: { name: 'Reliance Industries', sector: 'Conglomerate', price: 2950.80, pe: 28.4, high52: 3024.00, low52: 2220.00, diff1d: '+1.8%', diff1w: '+4.5%', mcap: '19.9T INR' },
  }

  const sym = ticker.toUpperCase()
  const info = companies[sym] || {
    name: `${sym} Corp.`,
    sector: 'Mixed',
    price: (Math.random() * 500 + 50).toFixed(2),
    pe: (Math.random() * 40 + 8).toFixed(1),
    high52: (Math.random() * 600 + 100).toFixed(2),
    low52: (Math.random() * 200 + 30).toFixed(2),
    diff1d: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 3).toFixed(1)}%`,
    diff1w: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 8).toFixed(1)}%`,
    mcap: `${(Math.random() * 100).toFixed(1)}B`
  }

  return {
    id: Date.now(),
    ticker_symbol: sym,
    company_name: info.name,
    query: query,
    status: 'completed',
    created_at: new Date().toISOString(),
    snapshot: {
      price: info.price,
      mcap: info.mcap,
      pe: info.pe,
      diff1d: info.diff1d,
      diff1w: info.diff1w,
      recommendation: parseFloat(info.pe) > 40 ? 'HOLD' : parseFloat(info.pe) < 25 ? 'BUY' : 'BUY',
    },
    // Simple AI Summary
    summary: {
      text: `${info.name} is showing steady performance in the ${info.sector} sector. Analysts note consistent growth with manageable risk levels.`,
      bullets: [
        `Revenue Trend: 📈 Showing strong YoY growth of ${(Math.random() * 15 + 5).toFixed(1)}%`,
        `Profit Trend: ${parseFloat(info.pe) < 30 ? '📈 Margins are expanding' : '→ Margins remain stable'}`,
        `Risk Factors: Susceptible to macro headwinds and sector volatility.`,
        `Growth Potential: Investing heavily in emerging technologies and R&D.`,
      ]
    },
    fundamental_analysis: {
      summary: `${info.name} shows solid fundamentals with a P/E ratio of ${info.pe}. Revenue growth remains strong with healthy operating margins.`,
      strengths: [
        'Strong brand moat and market positioning',
        'Consistent revenue growth over the past 5 years',
        'Healthy cash flow generation and reserves',
        'Strategic investments in AI and emerging technologies',
      ],
      weaknesses: [
        'Elevated P/E ratio relative to sector average',
        'Increasing regulatory scrutiny in key markets',
        'Dependency on single product line for majority revenue',
      ],
      metrics: {
        pe_ratio: parseFloat(info.pe),
        current_price: parseFloat(info.price),
        '52w_high': parseFloat(info.high52),
        '52w_low': parseFloat(info.low52),
        roi_estimate: `${(Math.random() * 15 + 5).toFixed(1)}%`,
        debt_to_equity: (Math.random() * 1.5 + 0.2).toFixed(2),
      },
      verdict: parseFloat(info.pe) > 35 ? 'Hold' : 'Buy',
    },
    sentiment_analysis: {
      sentiment_score: parseFloat((Math.random() * 1.2 - 0.2).toFixed(2)),
      mood: Math.random() > 0.4 ? 'Bullish' : 'Cautiously Optimistic',
      headlines: [
        { text: `${info.name} beats quarterly earnings estimates, shares rally.`, label: 'Positive', sentiment: 'positive' },
        { text: `Analysts upgrade ${sym} target price citing strong fundamental moat.`, label: 'Positive', sentiment: 'positive' },
        { text: `Macro headwinds pose temporary challenge to ${info.sector} margins.`, label: 'Neutral', sentiment: 'neutral' },
        { text: `Regulatory bodies hint at stricter compliance for ${sym}.`, label: 'Negative', sentiment: 'negative' },
      ],
      buzz_level: Math.random() > 0.5 ? 'High' : 'Medium',
      summary: `Market sentiment for ${sym} is predominantly positive, driven by strong earnings reports and strategic AI investments.`,
    },
    risk_assessment: {
      risk_level: parseFloat(info.pe) > 50 ? 'High' : parseFloat(info.pe) < 20 ? 'Low' : 'Medium',
      warnings: [
        'Macroeconomic uncertainty may impact consumer spending',
        'Geopolitical risks in key supply chain regions',
        'Competitive pressure from emerging players',
        'Interest rate environment affecting growth valuations',
      ],
      risk_summary: `${sym} carries ${parseFloat(info.pe) > 50 ? 'high' : 'moderate'} risk primarily driven by valuation concerns and macro headwinds.`,
      volatility_index: (Math.random() * 30 + 15).toFixed(1),
    },
    valuation: {
      valuation_status: parseFloat(info.pe) > 40 ? 'Slightly Overvalued' : parseFloat(info.pe) < 15 ? 'Undervalued' : 'Fairly Valued',
      fair_price_estimate: `$${(parseFloat(info.price) * (0.9 + Math.random() * 0.3)).toFixed(2)} - $${(parseFloat(info.price) * (1.1 + Math.random() * 0.2)).toFixed(2)}`,
      reasoning: `Based on DCF analysis and peer comparison, ${sym} appears to be ${parseFloat(info.pe) > 40 ? 'trading at a premium' : 'reasonably priced'} relative to its intrinsic value.`,
    },
    chart_data: Array.from({ length: 30 }).map((_, i) => ({
      name: `Day ${i + 1}`,
      price: parseFloat((parseFloat(info.price) * (0.9 + Math.random() * 0.2)).toFixed(2)),
    })),
  }
}

const PIPELINE_STEPS = [
  { key: 'fetch', label: 'Fetching market data', icon: '📡' },
  { key: 'fundamental', label: 'Analyzing fundamentals', icon: '📊' },
  { key: 'sentiment', label: 'Evaluating sentiment', icon: '💬' },
  { key: 'risk', label: 'Assessing risks', icon: '⚠️' },
  { key: 'valuation', label: 'Calculating valuation', icon: '💰' },
  { key: 'done', label: 'Finalizing verdict', icon: '✅' },
]

// Smart Query Mapping
const SMART_QUERIES = [
  { trigger: 'high dividend tech', match: 'tech', targets: ['MSFT', 'AAPL'] },
  { trigger: 'indian IT', match: 'it', targets: ['TCS', 'INFY'] },
  { trigger: 'growth stocks', match: 'growth', targets: ['NVDA', 'TSLA'] },
  { trigger: 'conglomerate', match: 'conglomerate', targets: ['RELIANCE'] },
]

function Dashboard() {
  const { user } = useAuth()
  const { toasts, addToast, removeToast } = useToast()
  const [query, setQuery] = useState('')
  const [ticker, setTicker] = useState('')
  const [reports, setReports] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(false)
  const [pipelineStep, setPipelineStep] = useState(-1)
  const [smartSuggestions, setSmartSuggestions] = useState([])

  // Load saved data
  useEffect(() => {
    if (user) {
      const savedReports = localStorage.getItem(`reports_${user.id}`)
      if (savedReports) {
        try { setReports(JSON.parse(savedReports)) } catch {}
      }
      const savedWatchlist = localStorage.getItem(`watchlist_${user.id}`)
      if (savedWatchlist) {
        try { setWatchlist(JSON.parse(savedWatchlist)) } catch {}
      }
    }
  }, [user])

  // Persist reports & watchlist
  useEffect(() => {
    if (user && reports.length > 0) localStorage.setItem(`reports_${user.id}`, JSON.stringify(reports))
  }, [reports, user])

  useEffect(() => {
    if (user) localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(watchlist))
  }, [watchlist, user])

  // Evaluate Smart Query
  useEffect(() => {
    if (query.trim().length > 3) {
      const q = query.toLowerCase()
      const matches = SMART_QUERIES.filter(sq => q.includes(sq.match) || q.includes(sq.trigger))
      if (matches.length > 0) {
        setSmartSuggestions([...new Set(matches.flatMap(m => m.targets))])
      } else {
        setSmartSuggestions([])
      }
    } else {
      setSmartSuggestions([])
    }
  }, [query])

  const handleNewResearch = async (e, directTicker = null) => {
    if (e) e.preventDefault()
    const targetTicker = directTicker || ticker

    if (!targetTicker.trim()) {
      addToast('Please enter a stock ticker symbol (e.g. AAPL)', 'warning')
      return
    }

    setTicker(targetTicker)
    setLoading(true)
    setPipelineStep(0)

    try {
      for (let i = 0; i < PIPELINE_STEPS.length; i++) {
        setPipelineStep(i)
        await new Promise((r) => setTimeout(r, 600 + Math.random() * 400))
      }

      const report = generateMockReport(targetTicker, query || `Comprehensive analysis of ${targetTicker.toUpperCase()}`)
      setReports([report, ...reports])
      setQuery('')
      setTicker('')
      setSmartSuggestions([])
      addToast(`Research report for ${targetTicker.toUpperCase()} generated successfully!`, 'success')
    } catch (error) {
      addToast('Failed to generate research report.', 'error')
    }

    setLoading(false)
    setPipelineStep(-1)
  }

  const toggleWatchlist = (e, sym) => {
    e.preventDefault()
    e.stopPropagation()
    if (watchlist.includes(sym)) {
      setWatchlist(watchlist.filter(t => t !== sym))
      addToast(`${sym} removed from watchlist`, 'info')
    } else {
      setWatchlist([...watchlist, sym])
      addToast(`${sym} added to watchlist!`, 'success')
    }
  }

  return (
    <div className="dashboard fade-in" id="dashboard-page">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <header className="dashboard-header">
        <div className="header-content">
          <h1>Research Dashboard</h1>
          <p className="subtitle">Launch AI-powered stock analysis with autonomous agents</p>
        </div>
        {user && (
          <div className="header-actions">
            <Link to="/compare" className="btn btn-secondary">⚖️ Compare Stocks</Link>
            <div className="header-welcome">
              <span className="welcome-msg">Welcome, <strong>{user.username}</strong></span>
            </div>
          </div>
        )}
      </header>

      <div className="dashboard-layout">
        <div className="main-column">
          {/* New Research Form */}
          <section className="card-static new-research" id="new-research-form">
            <h2>🚀 New Research</h2>
            <form onSubmit={handleNewResearch} className="research-form">
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="ticker-input">Stock Ticker</label>
                  <input
                    id="ticker-input"
                    type="text"
                    className="input-field"
                    placeholder="e.g. AAPL, TCS, NVDA"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    disabled={loading}
                  />
                </div>
                <div className="input-group" style={{ flex: 2, position: 'relative' }}>
                  <label htmlFor="query-input">Smart Query (optional) 💡</label>
                  <input
                    id="query-input"
                    type="text"
                    className="input-field"
                    placeholder='e.g. "high dividend tech" or "indian it"'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                  />
                  {/* Smart Query Dropdown */}
                  {smartSuggestions.length > 0 && !loading && (
                    <div className="smart-suggestions fade-in">
                      <span className="smart-label">🎯 AI Suggestions for your query:</span>
                      <div className="smart-chips">
                        {smartSuggestions.map(s => (
                          <button key={s} type="button" className="suggestion-chip" onClick={() => handleNewResearch(null, s)}>
                            {s} / Analyze Now
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner"></span> Running Pipeline...</> : '⚡ Start Research'}
              </button>
            </form>

            {/* Pipeline Progress */}
            {loading && (
              <div className="pipeline-progress" id="pipeline-progress">
                {PIPELINE_STEPS.map((step, i) => (
                  <div key={step.key} className={`pipeline-step ${ i < pipelineStep ? 'step-done' : i === pipelineStep ? 'step-active' : 'step-pending' }`}>
                    <span className="step-icon">{i < pipelineStep ? '✅' : step.icon}</span>
                    <span className="step-label">{step.label}</span>
                    {i === pipelineStep && <span className="spinner step-spinner"></span>}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Reports List */}
          <section className="reports-section">
            <div className="reports-header">
              <h2>📄 Recent Reports</h2>
              {reports.length > 0 && <span className="report-count">{reports.length} report{reports.length !== 1 ? 's' : ''}</span>}
            </div>
            {reports.length === 0 ? (
              <div className="empty-state card-static">
                <div className="empty-icon">📈</div>
                <h3>No research reports yet</h3>
                <p>Enter a stock ticker above and click "Start Research" to generate your first AI-powered analysis.</p>
              </div>
            ) : (
              <div className="reports-grid">
                {reports.map((report) => (
                  <Link to={`/report/${report.id}`} key={report.id} className="report-card card">
                    <div className="report-card-header">
                      <div className="report-ticker-group">
                        <span className="report-ticker">{report.ticker_symbol || '🔍'}</span>
                        <button className="watchlist-star-btn" onClick={(e) => toggleWatchlist(e, report.ticker_symbol)}>
                          {watchlist.includes(report.ticker_symbol) ? '⭐' : '☆'}
                        </button>
                      </div>
                      <span className={`badge badge-${report.status.replace('_', '-')}`}>{report.status}</span>
                    </div>
                    {report.company_name && <span className="report-company">{report.company_name}</span>}
                    <p className="report-query">{report.query}</p>
                    <div className="report-card-footer">
                      <span className="report-date">{new Date(report.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="report-view">View Insights →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Watchlist Sidebar */}
        <div className="sidebar-column">
          <div className="card-static watchlist-card">
            <div className="watchlist-header">
              <h2>⭐ Watchlist</h2>
              <span className="badge badge-pending">{watchlist.length} saved</span>
            </div>
            {watchlist.length === 0 ? (
              <p className="empty-watchlist-text">Star a report to save it here.</p>
            ) : (
              <div className="watchlist-list">
                {watchlist.map(sym => (
                  <div key={sym} className="watchlist-item">
                    <span className="watchlist-sym">{sym}</span>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleNewResearch(null, sym)}>Analyze</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
