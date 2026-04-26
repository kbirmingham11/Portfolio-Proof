'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'

const PARETO_DATA = [
  { cause: 'Ground Crew Shortage', delays: 342, pct: 38 },
  { cause: 'Late Aircraft Arrival', delays: 198, pct: 22 },
  { cause: 'Weather Disruption', delays: 153, pct: 17 },
  { cause: 'Baggage Handling', delays: 108, pct: 12 },
  { cause: 'Gate Conflicts', delays: 72, pct: 8 },
  { cause: 'Fueling Delays', delays: 27, pct: 3 },
]

const TREND_DATA = [
  { month: 'Jan', before: 142, after: 142 },
  { month: 'Feb', before: 158, after: 158 },
  { month: 'Mar', before: 171, after: 171 },
  { month: 'Apr', before: 163, after: 163 },
  { month: 'May', before: 189, after: 72 },
  { month: 'Jun', before: 201, after: 58 },
  { month: 'Jul', before: 178, after: 49 },
  { month: 'Aug', before: 195, after: 41 },
]

const FISHBONE = {
  effect: 'Gate Turnaround Delays > 20min',
  categories: [
    {
      name: 'Manpower',
      color: '#22D4BC',
      causes: ['Understaffed shifts', 'High turnover rate', 'Training gaps', 'Break scheduling'],
    },
    {
      name: 'Equipment',
      color: '#F4A535',
      causes: ['Jetway malfunctions', 'GSE availability', 'Fuel truck delays', 'Baggage cart shortage'],
    },
    {
      name: 'Process',
      color: '#6B8CFF',
      causes: ['Communication gaps', 'Unclear handoffs', 'Manual tracking', 'No real-time alerts'],
    },
    {
      name: 'Environment',
      color: '#FF6B6B',
      causes: ['Weather conditions', 'Runway congestion', 'Terminal crowding', 'Seasonal demand spikes'],
    },
  ],
}

const FIVE_WHYS = [
  { q: 'Why did Flight 447 depart 34 minutes late?', a: 'The aircraft was not cleaned and provisioned on time.' },
  { q: 'Why was cleaning/provisioning delayed?', a: 'The cabin crew team arrived 18 minutes after aircraft arrival.' },
  { q: 'Why did the crew arrive late?', a: 'They were finishing service on an inbound delayed flight.' },
  { q: 'Why was the inbound flight delayed?', a: 'No buffer was built into the crew rotation schedule.' },
  { q: 'Why is there no schedule buffer?', a: 'Root cause: Scheduling algorithm optimizes for cost, not on-time performance resilience.' },
]

export default function RootCauseDashboard() {
  const [view, setView] = useState('executive')
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [whyStep, setWhyStep] = useState(0)

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'var(--font-dm-sans)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--accent-cyan)', marginBottom: '0.3rem' }}>
            SAMPLE DATA — DEMONSTRATION PURPOSES ONLY
          </p>
          <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Gate Turnaround Performance Analysis
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['executive', 'detailed'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.1em',
              padding: '0.4rem 0.85rem', borderRadius: '6px', cursor: 'pointer',
              background: view === v ? 'var(--accent-cyan)' : 'var(--bg-surface)',
              color: view === v ? '#050A14' : 'var(--text-muted)',
              border: `1px solid ${view === v ? 'var(--accent-cyan)' : 'var(--border)'}`,
              transition: 'all 0.2s ease',
            }}>
              {v === 'executive' ? 'Executive View' : 'Detailed Analysis'}
            </button>
          ))}
        </div>
      </div>

      {view === 'executive' ? (
        <div>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Avg Delay', value: '18.4 min', delta: '-31%', good: true },
              { label: 'On-Time Rate', value: '84.2%', delta: '+12%', good: true },
              { label: 'Monthly Incidents', value: '41', delta: '-79%', good: true },
              { label: 'Root Causes ID\'d', value: '6', delta: null },
            ].map(kpi => (
              <div key={kpi.label} style={{
                background: 'var(--bg-surface)', borderRadius: '8px',
                padding: '0.85rem', border: '1px solid var(--border)',
              }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{kpi.label}</p>
                <p style={{ fontFamily: 'var(--font-syne)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>{kpi.value}</p>
                {kpi.delta && (
                  <p style={{ fontSize: '11px', color: kpi.good ? 'var(--accent-cyan)' : '#FF6B6B', marginTop: '0.2rem' }}>
                    {kpi.delta} post-action
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '1rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
              // EXECUTIVE RECOMMENDATIONS
            </p>
            {[
              { priority: 'P1', action: 'Revise crew scheduling algorithm to include 15-min buffer on high-traffic routes', impact: 'Est. -42% delay recurrence' },
              { priority: 'P2', action: 'Deploy real-time GSE tracking to eliminate equipment search delays', impact: 'Est. -18min avg turnaround' },
              { priority: 'P3', action: 'Implement automated staffing alerts for below-threshold shift coverage', impact: 'Est. -23% understaffing incidents' },
            ].map(r => (
              <div key={r.priority} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
                <span style={{
                  fontFamily: 'var(--font-jetbrains)', fontSize: '9px',
                  background: r.priority === 'P1' ? '#FF6B6B20' : r.priority === 'P2' ? '#F4A53520' : '#22D4BC20',
                  color: r.priority === 'P1' ? '#FF6B6B' : r.priority === 'P2' ? '#F4A535' : '#22D4BC',
                  padding: '0.2rem 0.4rem', borderRadius: '4px', flexShrink: 0,
                }}>
                  {r.priority}
                </span>
                <div>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>{r.action}</p>
                  <p style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>{r.impact}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trend Chart */}
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            // DELAY INCIDENTS — BEFORE vs AFTER CORRECTIVE ACTION (MAY IMPLEMENTATION)
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-jetbrains)' }} />
              <Line type="monotone" dataKey="before" stroke="#FF6B6B" strokeWidth={2} dot={false} name="Baseline" />
              <Line type="monotone" dataKey="after" stroke="#22D4BC" strokeWidth={2} dot={false} name="Post-Action" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div>
          {/* Pareto Chart */}
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            // PARETO ANALYSIS — TOP CONTRIBUTING FACTORS
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PARETO_DATA} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="cause" tick={{ fontSize: 9, fill: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)' }} angle={-20} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }} />
              <Bar dataKey="delays" fill="#22D4BC" radius={[3, 3, 0, 0]} name="Delay Incidents" />
            </BarChart>
          </ResponsiveContainer>

          {/* Fishbone */}
          <div style={{ margin: '1.5rem 0' }}>
            <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              // ISHIKAWA DIAGRAM — CLICK CATEGORY TO EXPAND
            </p>
            <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', background: '#FF6B6B20', color: '#FF6B6B', padding: '0.3rem 0.75rem', borderRadius: '4px' }}>
                  EFFECT: {FISHBONE.effect}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                {FISHBONE.categories.map(cat => (
                  <div key={cat.name}
                    onClick={() => setExpandedCategory(expandedCategory === cat.name ? null : cat.name)}
                    style={{
                      border: `1px solid ${expandedCategory === cat.name ? cat.color : 'var(--border)'}`,
                      borderRadius: '8px', padding: '0.75rem', cursor: 'pointer',
                      background: expandedCategory === cat.name ? `${cat.color}10` : 'var(--bg-secondary)',
                      transition: 'all 0.2s ease',
                    }}>
                    <p style={{ fontFamily: 'var(--font-syne)', fontSize: '13px', fontWeight: 700, color: cat.color, marginBottom: '0.5rem' }}>
                      {cat.name}
                    </p>
                    {expandedCategory === cat.name && cat.causes.map(c => (
                      <p key={c} style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '0.25rem', paddingLeft: '0.5rem', borderLeft: `2px solid ${cat.color}` }}>
                        {c}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5 Whys */}
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            // 5 WHYS DRILL-DOWN
          </p>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '1rem', border: '1px solid var(--border)' }}>
            {FIVE_WHYS.slice(0, whyStep + 1).map((w, i) => (
              <div key={i} style={{ marginBottom: '0.75rem', paddingLeft: '0.75rem', borderLeft: `2px solid ${i === whyStep ? 'var(--accent-cyan)' : 'var(--border)'}` }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-jetbrains)', marginBottom: '0.2rem' }}>WHY {i + 1}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{w.q}</p>
                <p style={{ fontSize: '13px', color: i === FIVE_WHYS.length - 1 ? '#FF6B6B' : 'var(--text-primary)', fontWeight: i === FIVE_WHYS.length - 1 ? 500 : 400 }}>{w.a}</p>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              {whyStep < FIVE_WHYS.length - 1 && (
                <button onClick={() => setWhyStep(whyStep + 1)} style={{
                  fontFamily: 'var(--font-jetbrains)', fontSize: '10px', padding: '0.35rem 0.75rem',
                  background: 'var(--accent-cyan)', color: '#050A14', border: 'none', borderRadius: '6px', cursor: 'pointer',
                }}>
                  NEXT WHY →
                </button>
              )}
              {whyStep > 0 && (
                <button onClick={() => setWhyStep(0)} style={{
                  fontFamily: 'var(--font-jetbrains)', fontSize: '10px', padding: '0.35rem 0.75rem',
                  background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer',
                }}>
                  RESET
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
