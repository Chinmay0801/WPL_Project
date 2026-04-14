import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const MOCK_DB = {
  AAPL: { revenue: '↑ 8%', profit: '↑ 12%', risk: 'Low', pe: 32.1, debt: 'Medium', sentiment: 'Positive' },
  MSFT: { revenue: '↑ 14%', profit: '↑ 18%', risk: 'Low', pe: 37.8, debt: 'Low', sentiment: 'Positive' },
  NVDA: { revenue: '↑ 120%', profit: '↑ 140%', risk: 'High', pe: 68.2, debt: 'Low', sentiment: 'Very Positive' },
  TSLA: { revenue: '↑ 3%', profit: '↓ 5%', risk: 'High', pe: 72.5, debt: 'Medium', sentiment: 'Neutral' },
  TCS: { revenue: '↑ 6%', profit: '↑ 8%', risk: 'Low', pe: 30.5, debt: 'Low', sentiment: 'Positive' },
  INFY: { revenue: '↑ 4%', profit: '→ 0%', risk: 'Medium', pe: 24.2, debt: 'Low', sentiment: 'Neutral' },
  RELIANCE: { revenue: '↑ 11%', profit: '↑ 9%', risk: 'Medium', pe: 28.4, debt: 'High', sentiment: 'Positive' },
}

function Compare() {
  const [stock1, setStock1] = useState('TCS')
  const [stock2, setStock2] = useState('INFY')

  const s1 = MOCK_DB[stock1]
  const s2 = MOCK_DB[stock2]

  return (
    <div className="dashboard fade-in" style={{ paddingBottom: '3rem' }}>
      <Link to="/" className="back-link" style={{ marginBottom: '1.5rem', display: 'inline-block', color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to Dashboard</Link>
      <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div className="header-content">
          <h1 style={{ fontSize: '2rem', fontWeight: 700, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>⚖️ Compare Stocks</h1>
          <p className="subtitle">Side-by-side metric comparison to identify the better investment</p>
        </div>
      </header>

      <section className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div className="input-group" style={{ flex: 1 }}>
          <label>Stock 1</label>
          <select className="input-field" value={stock1} onChange={e => setStock1(e.target.value)}>
            {Object.keys(MOCK_DB).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>VS</span>
        <div className="input-group" style={{ flex: 1 }}>
          <label>Stock 2</label>
          <select className="input-field" value={stock2} onChange={e => setStock2(e.target.value)}>
            {Object.keys(MOCK_DB).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </section>

      {s1 && s2 && (
        <section className="card-static" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Metric</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--accent-blue)', fontSize: '1.2rem' }}>{stock1}</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--accent-purple)', fontSize: '1.2rem' }}>{stock2}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>Revenue Growth</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: s1.revenue.includes('↑') ? 'var(--accent-green)' : 'inherit' }}>{s1.revenue}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: s2.revenue.includes('↑') ? 'var(--accent-green)' : 'inherit' }}>{s2.revenue}</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>Profitability</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: s1.profit.includes('↑') ? 'var(--accent-green)' : s1.profit.includes('↓') ? 'var(--accent-red)' : 'inherit' }}>{s1.profit}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: s2.profit.includes('↑') ? 'var(--accent-green)' : s2.profit.includes('↓') ? 'var(--accent-red)' : 'inherit' }}>{s2.profit}</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>Risk Level</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: s1.risk === 'High' ? 'var(--accent-red)' : s1.risk === 'Low' ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>{s1.risk}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', color: s2.risk === 'High' ? 'var(--accent-red)' : s2.risk === 'Low' ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>{s2.risk}</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>P/E Ratio</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{s1.pe}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{s2.pe}</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 500 }}>Debt</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{s1.debt}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{s2.debt}</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', fontWeight: 500 }}>Market Sentiment</td>
                <td style={{ padding: '1rem' }}><span className={`badge ${s1.sentiment.includes('Positive') ? 'badge-completed' : s1.sentiment.includes('Neutral') ? 'badge-pending' : 'badge-failed'}`}>{s1.sentiment}</span></td>
                <td style={{ padding: '1rem' }}><span className={`badge ${s2.sentiment.includes('Positive') ? 'badge-completed' : s2.sentiment.includes('Neutral') ? 'badge-pending' : 'badge-failed'}`}>{s2.sentiment}</span></td>
              </tr>
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}

export default Compare
