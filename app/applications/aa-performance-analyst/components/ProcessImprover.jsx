'use client'

import { useState } from 'react'

const EXAMPLES = {
  baggage: {
    label: 'Baggage Transfer Process',
    text: `When a connecting flight arrives, baggage handlers manually check paper manifests to identify transfer bags. They then physically locate each bag on the inbound belt, tag it with a paper transfer tag, and place it on a cart. A supervisor manually radios the outbound gate to confirm bag count. The cart is then driven across the tarmac. At the outbound aircraft, handlers re-verify each bag against a second paper manifest. If counts don't match, the process restarts from the inbound belt. Average transfer time is 47 minutes for connections under 90 minutes.`,
  },
  gate: {
    label: 'Gate Assignment & Turnaround',
    text: `Gate assignments are made by the operations center 2 hours before arrival. Agents are notified via a printed gate sheet distributed each morning. When a gate change occurs, the operations center calls each affected agent individually. Cleaning crews receive gate assignments via walkie-talkie from their supervisor, who receives updates from operations via phone. Catering trucks are scheduled the night before and are not dynamically updated. Fueling is requested by the inbound captain via radio after landing. Ground crew assembles at the gate approximately 10 minutes before estimated arrival.`,
  },
  weather: {
    label: 'Weather Delay Communication',
    text: `When weather delays are anticipated, the operations center issues a general delay notice via the internal PA system. Gate agents are responsible for updating flight boards manually. Passenger notifications are sent via the airline app, but gate agents are not always informed of app updates. Crew scheduling receives delay notifications via email, which may not be checked immediately. Catering and cleaning crews continue to their originally scheduled gates unless personally contacted. Ground handling contractors receive updates via fax to their break room. The average time from weather decision to all-parties notification is 34 minutes.`,
  },
}

export default function ProcessImprover() {
  const [input, setInput] = useState(EXAMPLES.baggage.text)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeExample, setActiveExample] = useState('baggage')
  const [showArchitecture, setShowArchitecture] = useState(false)

  const handleAnalyze = async () => {
    setLoading(true)
    setAnalysis(null)
    try {
      const response = await fetch('/api/analyze-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ process: input }),
      })
      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setAnalysis({ error: 'Analysis failed. Please check your API configuration.' })
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'var(--font-dm-sans)' }}>
      <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
        // AI-POWERED PROCESS ANALYSIS — LIVE CLAUDE API
      </p>

      {/* Example selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {Object.entries(EXAMPLES).map(([key, ex]) => (
          <button key={key} onClick={() => { setActiveExample(key); setInput(ex.text); setAnalysis(null) }} style={{
            fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.08em',
            padding: '0.3rem 0.65rem', borderRadius: '5px', cursor: 'pointer',
            background: activeExample === key ? 'var(--bg-surface)' : 'transparent',
            color: activeExample === key ? 'var(--accent-cyan)' : 'var(--text-muted)',
            border: `1px solid ${activeExample === key ? 'var(--accent-cyan)' : 'var(--border)'}`,
          }}>
            {ex.label}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={6}
        style={{
          width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '0.85rem', color: 'var(--text-primary)',
          fontFamily: 'var(--font-dm-sans)', fontSize: '13px', lineHeight: 1.6,
          resize: 'vertical', marginBottom: '0.75rem', boxSizing: 'border-box',
        }}
      />

      <button onClick={handleAnalyze} disabled={loading || !input.trim()} style={{
        fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.1em',
        padding: '0.5rem 1.25rem', background: loading ? 'var(--bg-surface)' : 'var(--accent-cyan)',
        color: loading ? 'var(--text-muted)' : '#050A14', border: 'none', borderRadius: '6px',
        cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '1.5rem',
      }}>
        {loading ? 'ANALYZING...' : 'ANALYZE WITH AI →'}
      </button>

      {analysis && !analysis.error && (
        <div>
          {/* Inefficiencies */}
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            // IDENTIFIED INEFFICIENCIES
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {(analysis.inefficiencies || []).map((item, i) => (
              <div key={i} style={{
                background: 'var(--bg-surface)', borderRadius: '8px', padding: '0.85rem',
                border: '1px solid var(--border)', borderLeft: '3px solid #FF6B6B',
              }}>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>

          {/* Improvements */}
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            // SUGGESTED IMPROVEMENTS
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {(analysis.improvements || []).map((item, i) => (
              <div key={i} style={{
                background: 'var(--bg-surface)', borderRadius: '8px', padding: '0.85rem',
                border: '1px solid var(--border)', borderLeft: '3px solid #22D4BC',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{item.suggestion}</p>
                  <span style={{
                    fontFamily: 'var(--font-jetbrains)', fontSize: '9px', whiteSpace: 'nowrap',
                    color: '#22D4BC', background: '#22D4BC15', padding: '0.2rem 0.4rem', borderRadius: '4px',
                  }}>
                    {item.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Risk factors */}
          {analysis.risks && (
            <>
              <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                // RISK FACTORS
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                {analysis.risks.map((r, i) => (
                  <span key={i} style={{
                    fontFamily: 'var(--font-jetbrains)', fontSize: '10px',
                    background: '#F4A53515', color: '#F4A535',
                    border: '1px solid #F4A53530', borderRadius: '5px', padding: '0.25rem 0.6rem',
                  }}>
                    {r}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {analysis?.error && (
        <div style={{ background: '#FF6B6B10', border: '1px solid #FF6B6B30', borderRadius: '8px', padding: '0.85rem' }}>
          <p style={{ fontSize: '13px', color: '#FF6B6B' }}>{analysis.error}</p>
        </div>
      )}

      {/* Architecture explainer */}
      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <button onClick={() => setShowArchitecture(!showArchitecture)} style={{
          fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.1em',
          background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0,
        }}>
          {showArchitecture ? '▼' : '▶'} HOW THIS WAS BUILT
        </button>
        {showArchitecture && (
          <div style={{ marginTop: '0.75rem', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <p>This component sends the process description to the Anthropic Claude API via a Next.js API route (<code style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', background: 'var(--bg-surface)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>/api/analyze-process</code>).</p>
            <p style={{ marginTop: '0.5rem' }}>The API route uses a structured prompt to instruct Claude to return JSON containing inefficiencies, improvement suggestions with estimated impact, and risk factors. The response is parsed and rendered into the UI above.</p>
            <p style={{ marginTop: '0.5rem' }}>This demonstrates both AI tool proficiency and the ability to identify and communicate process inefficiencies — two explicit requirements in the job posting.</p>
          </div>
        )}
      </div>
    </div>
  )
}
