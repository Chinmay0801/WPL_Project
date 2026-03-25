import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../services/api'
import './ResearchReport.css'

function ResearchReport() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/research/reports/${id}/`)
        setReport(response.data)
      } catch (error) {
        console.error('Failed to fetch report:', error)
      }
      setLoading(false)
    }
    fetchReport()
  }, [id])

  if (loading) {
    return (
      <div className="report-loading fade-in">
        <div className="loading-pulse">Loading report...</div>
      </div>
    )
  }

  if (!report) {
    return <div className="report-error fade-in">Report not found.</div>
  }

  return (
    <div className="research-report fade-in" id="research-report-page">
      <header className="report-header">
        <div className="report-header-top">
          <h1>{report.ticker_symbol || 'General Research'}</h1>
          <span className={`badge badge-${report.status.replace('_', '-')}`}>
            {report.status}
          </span>
        </div>
        <p className="report-query-text">{report.query}</p>
      </header>

      {report.summary && (
        <section className="card report-section" id="report-summary">
          <h2>📋 Summary</h2>
          <p>{report.summary}</p>
        </section>
      )}

      <div className="report-grid">
        <section className="card report-section" id="report-fundamentals">
          <h2>📊 Fundamental Analysis</h2>
          <pre className="report-json">
            {JSON.stringify(report.fundamental_analysis, null, 2) || 'Pending...'}
          </pre>
        </section>

        <section className="card report-section" id="report-sentiment">
          <h2>💬 Sentiment Analysis</h2>
          <pre className="report-json">
            {JSON.stringify(report.sentiment_analysis, null, 2) || 'Pending...'}
          </pre>
        </section>

        <section className="card report-section" id="report-risk">
          <h2>⚠️ Risk Assessment</h2>
          <pre className="report-json">
            {JSON.stringify(report.risk_assessment, null, 2) || 'Pending...'}
          </pre>
        </section>

        <section className="card report-section" id="report-valuation">
          <h2>💰 Valuation</h2>
          <pre className="report-json">
            {JSON.stringify(report.valuation, null, 2) || 'Pending...'}
          </pre>
        </section>
      </div>
    </div>
  )
}

export default ResearchReport
