'use client'

import { useState } from 'react'

const DEFAULT_METRICS = {
  onTimeRate: 84.2,
  avgDelay: 18.4,
  incidentsThisMonth: 41,
  incidentsDelta: -79,
  topStation: 'DFW',
  flightsAudited: 312,
  capCompleteRate: 73,
}

const AUDIENCES = ['C-Suite', 'VP', 'Director']

const getStatus = (value, thresholds) => {
  if (value >= thresholds.green) return { color: '#22D4BC', label: 'ON TARGET' }
  if (value >= thresholds.yellow) return { color: '#F4A535', label: 'MONITOR' }
  return { color: '#FF6B6B', label: 'ACTION REQUIRED' }
}

export default function ExecutiveBriefing() {
  const [metrics, setMetrics] = useState(DEFAULT_METRICS)
  const [audience, setAudience] = useState('VP')
  const [slide, setSlide] = useState(0)
  const [showNotes, setShowNotes] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)

  const onTimeStatus = getStatus(metrics.onTimeRate, { green: 85, yellow: 75 })
  const delayStatus = getStatus(100 - metrics.avgDelay, { green: 85, yellow: 75 })
  const capStatus = getStatus(metrics.capCompleteRate, { green: 80, yellow: 60 })

  const SLIDES = [
    {
      id: 'situation',
      title: 'Situation Overview',
      notes: audience === 'C-Suite'
        ? 'Frame this as a strategic opportunity. Emphasize the financial impact of the on-time improvement trajectory.'
        : 'Walk through each metric left to right. Pause on any yellow/red items to invite questions before moving on.',
      content: (
        <div>
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '1rem' }}>
            PERFORMANCE ASSURANCE — MONTHLY SITUATION REPORT
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
            {[
              { label: 'On-Time Departure Rate', value: `${metrics.onTimeRate}%`, status: onTimeStatus, target: '85%' },
              { label: 'Avg Gate Delay', value: `${metrics.avgDelay} min`, status: delayStatus, target: '< 15 min' },
              { label: 'Safety Incidents (MTD)', value: metrics.incidentsThisMonth, status: getStatus(100 - metrics.incidentsThisMonth, { green: 60, yellow: 40 }), target: '< 50' },
              { label: 'CAP Completion Rate', value: `${metrics.capCompleteRate}%`, status: capStatus, target: '80%' },
            ].map(m => (
              <div key={m.label} style={{
                background: 'var(--bg-surface)', borderRadius: '10px', padding: '1rem',
                border: `1px solid ${m.status.color}30`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.label}</span>
                  <span style={{
                    fontFamily: 'var(--font-jetbrains)', fontSize: '8px',
                    color: m.status.color, background: `${m.status.color}15`,
                    padding: '0.15rem 0.35rem', borderRadius: '3px',
                  }}>
                    {m.status.label}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-syne)', fontSize: '1.5rem', fontWeight: 700, color: m.status.color }}>{m.value}</p>
                <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--text-muted)', marginTop: '0.3rem' }}>TARGET: {m.target}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'causes',
      title: 'Root Causes Identified',
      notes: 'This slide is evidence-based. Each cause is supported by audit data. If asked for specifics, reference the full audit report appendix.',
      content: (
        <div>
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '1rem' }}>
            TOP 3 CONTRIBUTING FACTORS — BASED ON {metrics.flightsAudited} AUDITED FLIGHTS
          </p>
          {[
            { rank: '01', cause: 'Crew Scheduling Gaps', data: '38% of delays traceable to under-staffed shifts', impact: 'High' },
            { rank: '02', cause: 'Equipment Availability', data: 'GSE search avg adds 8.2 min to turnaround time', impact: 'Medium' },
            { rank: '03', cause: 'Communication Latency', data: 'Gate change notifications avg 34 min delay', impact: 'Medium' },
          ].map(item => (
            <div key={item.rank} style={{
              display: 'flex', gap: '1rem', alignItems: 'flex-start',
              marginBottom: '0.85rem', padding: '0.85rem',
              background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border)',
            }}>
              <span style={{ fontFamily: 'var(--font-syne)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--border-strong)', flexShrink: 0 }}>
                {item.rank}
              </span>
              <div>
                <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{item.cause}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.data}</p>
              </div>
              <span style={{
                fontFamily: 'var(--font-jetbrains)', fontSize: '9px', marginLeft: 'auto', flexShrink: 0,
                color: item.impact === 'High' ? '#FF6B6B' : '#F4A535',
                background: item.impact === 'High' ? '#FF6B6B15' : '#F4A53515',
                padding: '0.2rem 0.4rem', borderRadius: '4px',
              }}>
                {item.impact.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      notes: audience === 'C-Suite'
        ? 'Lead with the ROI framing. Each recommendation has an estimated financial or operational return. Secure approval on P1 today.'
        : 'Walk through each priority item. P1 requires cross-functional coordination — identify owners before leaving the room.',
      content: (
        <div>
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '1rem' }}>
            PRIORITIZED ACTION ITEMS — Q1 IMPLEMENTATION ROADMAP
          </p>
          {[
            { priority: 'P1', action: 'Revise crew scheduling algorithm to include 15-min buffer on high-traffic routes', impact: 'Est. -42% delay recurrence', timeline: '30 days', owner: 'Operations' },
            { priority: 'P2', action: 'Deploy real-time GSE tracking across DFW, LAX, ORD hubs', impact: 'Est. -8 min avg turnaround', timeline: '60 days', owner: 'Ground Ops' },
            { priority: 'P3', action: 'Implement automated multi-channel delay notification system', impact: 'Est. notification time -74%', timeline: '45 days', owner: 'IT + Ops' },
          ].map(r => (
            <div key={r.priority} style={{
              marginBottom: '0.75rem', padding: '0.85rem',
              background: 'var(--bg-surface)', borderRadius: '8px',
              border: '1px solid var(--border)',
              borderLeft: `3px solid ${r.priority === 'P1' ? '#FF6B6B' : r.priority === 'P2' ? '#F4A535' : '#22D4BC'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{
                  fontFamily: 'var(--font-jetbrains)', fontSize: '9px',
                  color: r.priority === 'P1' ? '#FF6B6B' : r.priority === 'P2' ? '#F4A535' : '#22D4BC',
                }}>
                  {r.priority} — {r.owner} — {r.timeline}
                </span>
                <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: '#22D4BC' }}>{r.impact}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{r.action}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'appendix',
      title: 'Appendix',
      notes: 'This slide is for reference only. Do not present unless asked. If questions arise about methodology, direct to the full audit report.',
      content: (
        <div>
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '1rem' }}>
            METHODOLOGY & DETAILED DATA
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '0.85rem', border: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>AUDIT METHODOLOGY</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Direct observation at 6 stations over 30-day period. {metrics.flightsAudited} flight turnarounds observed. 8 checkpoint categories evaluated per observation.</p>
            </div>
            <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '0.85rem', border: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>DATA SOURCES</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>OPS performance system, ACARS data, manual observation logs, crew interview records, maintenance system exports.</p>
            </div>
            <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '0.85rem', border: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>SAMPLE DATA NOTICE</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>All data in this presentation is fictional and for demonstration purposes only. Created to showcase analytical and presentation capabilities.</p>
            </div>
            <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '0.85rem', border: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>STATIONS COVERED</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>DFW, LAX, ORD, ATL, MIA, JFK — representing 6 of the top 10 domestic hubs by operations volume.</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const currentSlide = SLIDES[slide]

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'var(--font-dm-sans)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--accent-cyan)' }}>
          // EXECUTIVE BRIEFING GENERATOR
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {AUDIENCES.map(a => (
            <button key={a} onClick={() => setAudience(a)} style={{
              fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.08em',
              padding: '0.3rem 0.6rem', borderRadius: '5px', cursor: 'pointer',
              background: audience === a ? 'var(--accent-cyan)' : 'var(--bg-surface)',
              color: audience === a ? '#050A14' : 'var(--text-muted)',
              border: `1px solid ${audience === a ? 'var(--accent-cyan)' : 'var(--border)'}`,
            }}>
              {a}
            </button>
          ))}
          <button onClick={() => setShowNotes(!showNotes)} style={{
            fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.08em',
            padding: '0.3rem 0.6rem', borderRadius: '5px', cursor: 'pointer',
            background: showNotes ? 'var(--bg-surface)' : 'transparent',
            color: 'var(--text-muted)', border: '1px solid var(--border)',
          }}>
            {showNotes ? '▼ NOTES' : '▶ NOTES'}
          </button>
        </div>
      </div>

      {/* Slide nav */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {SLIDES.map((s, i) => (
          <button key={s.id} onClick={() => setSlide(i)} style={{
            fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.05em',
            padding: '0.3rem 0.6rem', borderRadius: '5px', cursor: 'pointer',
            background: slide === i ? 'var(--bg-surface)' : 'transparent',
            color: slide === i ? 'var(--text-primary)' : 'var(--text-muted)',
            border: `1px solid ${slide === i ? 'var(--border-strong)' : 'var(--border)'}`,
          }}>
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      {/* Slide content */}
      <div style={{
        background: 'var(--bg-secondary)', borderRadius: '12px',
        border: '1px solid var(--border)', padding: '1.5rem',
        minHeight: '280px', marginBottom: '0.75rem',
      }}>
        <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          {currentSlide.title}
        </h3>
        {currentSlide.content}
      </div>

      {/* Speaker notes */}
      {showNotes && (
        <div style={{ background: '#F4A53510', border: '1px solid #F4A53530', borderRadius: '8px', padding: '0.85rem', marginBottom: '0.75rem' }}>
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: '#F4A535', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
            SPEAKER NOTES — {audience.toUpperCase()} AUDIENCE
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{currentSlide.notes}</p>
        </div>
      )}

      {/* Nav buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setSlide(Math.max(0, slide - 1))} disabled={slide === 0} style={{
          fontFamily: 'var(--font-jetbrains)', fontSize: '10px', padding: '0.4rem 0.85rem',
          background: 'var(--bg-surface)', color: slide === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
          border: '1px solid var(--border)', borderRadius: '6px', cursor: slide === 0 ? 'not-allowed' : 'pointer',
        }}>
          ← PREV
        </button>
        <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', color: 'var(--text-muted)', alignSelf: 'center' }}>
          {slide + 1} / {SLIDES.length}
        </span>
        <button onClick={() => setSlide(Math.min(SLIDES.length - 1, slide + 1))} disabled={slide === SLIDES.length - 1} style={{
          fontFamily: 'var(--font-jetbrains)', fontSize: '10px', padding: '0.4rem 0.85rem',
          background: 'var(--bg-surface)', color: slide === SLIDES.length - 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
          border: '1px solid var(--border)', borderRadius: '6px', cursor: slide === SLIDES.length - 1 ? 'not-allowed' : 'pointer',
        }}>
          NEXT →
        </button>
      </div>
    </div>
  )
}
