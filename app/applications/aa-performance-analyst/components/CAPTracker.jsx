'use client'

import { useState, useMemo } from 'react'

const INITIAL_DATA = [
  { id: 'CAP-001', station: 'DFW', category: 'Safety', finding: 'PPE non-compliance on ramp', action: 'Mandatory PPE retraining + signage', targetDate: '2024-11-15', status: 'Closed', effectiveness: 94, recurrence: false, daysToClose: 12 },
  { id: 'CAP-002', station: 'LAX', category: 'Process', finding: 'Baggage manifest not verified pre-load', action: 'Digital manifest check implementation', targetDate: '2024-11-20', status: 'Closed', effectiveness: 88, recurrence: false, daysToClose: 18 },
  { id: 'CAP-003', station: 'ORD', category: 'Safety', finding: 'De-icing post-inspection skipped', action: 'Checklist added to de-icing SOP', targetDate: '2024-11-10', status: 'Closed', effectiveness: 97, recurrence: false, daysToClose: 8 },
  { id: 'CAP-004', station: 'ATL', category: 'Communication', finding: 'Gate change notifications delayed', action: 'Real-time ops alert system deployed', targetDate: '2024-12-01', status: 'In Progress', effectiveness: 72, recurrence: false, daysToClose: null },
  { id: 'CAP-005', station: 'MIA', category: 'Process', finding: 'Turnaround avg 28min vs 20min target', action: 'Staffing model revised for peak hours', targetDate: '2024-11-25', status: 'Closed', effectiveness: 81, recurrence: false, daysToClose: 22 },
  { id: 'CAP-006', station: 'DFW', category: 'Safety', finding: 'Cell phone use during taxi operations', action: 'Policy enforcement + disciplinary framework', targetDate: '2024-11-12', status: 'Closed', effectiveness: 91, recurrence: false, daysToClose: 10 },
  { id: 'CAP-007', station: 'JFK', category: 'Documentation', finding: 'SOP binder inaccessible to crew', action: 'Digital SOP system on crew tablets', targetDate: '2024-12-10', status: 'In Progress', effectiveness: 65, recurrence: false, daysToClose: null },
  { id: 'CAP-008', station: 'LAX', category: 'Safety', finding: 'Weight manifest verification gaps', action: 'Automated weight alert integration', targetDate: '2024-11-30', status: 'Closed', effectiveness: 89, recurrence: false, daysToClose: 15 },
  { id: 'CAP-009', station: 'ORD', category: 'Communication', finding: 'Weather delay notification avg 34min', action: 'Automated multi-channel alert system', targetDate: '2024-12-05', status: 'In Progress', effectiveness: 58, recurrence: false, daysToClose: null },
  { id: 'CAP-010', station: 'ATL', category: 'Process', finding: 'Catering not dynamically updated on delays', action: 'Catering system API integration', targetDate: '2024-12-15', status: 'Open', effectiveness: null, recurrence: false, daysToClose: null },
  { id: 'CAP-011', station: 'MIA', category: 'Safety', finding: 'Ramp vehicle speed violations', action: 'Speed monitoring sensors installed', targetDate: '2024-11-18', status: 'Closed', effectiveness: 96, recurrence: false, daysToClose: 14 },
  { id: 'CAP-012', station: 'DFW', category: 'Process', finding: 'Fuel request delays post-landing', action: 'Pre-arrival fuel request protocol', targetDate: '2024-11-22', status: 'Closed', effectiveness: 85, recurrence: false, daysToClose: 19 },
  { id: 'CAP-013', station: 'JFK', category: 'Safety', finding: 'Jetway malfunction response time > 15min', action: 'Maintenance on-call rotation restructured', targetDate: '2024-12-08', status: 'In Progress', effectiveness: 70, recurrence: false, daysToClose: null },
  { id: 'CAP-014', station: 'LAX', category: 'Documentation', finding: 'Crew briefing notes outdated (4+ days)', action: 'Daily briefing update requirement enforced', targetDate: '2024-11-14', status: 'Closed', effectiveness: 92, recurrence: false, daysToClose: 9 },
  { id: 'CAP-015', station: 'ORD', category: 'Process', finding: 'GSE availability causing 8min avg delay', action: 'GSE real-time tracking system', targetDate: '2024-12-20', status: 'Open', effectiveness: null, recurrence: false, daysToClose: null },
]

const STATUS_COLOR = { Closed: '#22D4BC', 'In Progress': '#F4A535', Open: '#6B8CFF' }
const CATEGORIES = ['All', 'Safety', 'Process', 'Communication', 'Documentation']
const STATIONS = ['All', 'DFW', 'LAX', 'ORD', 'ATL', 'MIA', 'JFK']
const STATUSES = ['All', 'Closed', 'In Progress', 'Open']

export default function CAPTracker() {
  const [filters, setFilters] = useState({ station: 'All', category: 'All', status: 'All' })
  const [sortBy, setSortBy] = useState('id')
  const [showScalability, setShowScalability] = useState(false)

  const filtered = useMemo(() => {
    return INITIAL_DATA.filter(row =>
      (filters.station === 'All' || row.station === filters.station) &&
      (filters.category === 'All' || row.category === filters.category) &&
      (filters.status === 'All' || row.status === filters.status)
    ).sort((a, b) => {
      if (sortBy === 'effectiveness') return (b.effectiveness || 0) - (a.effectiveness || 0)
      if (sortBy === 'daysToClose') return (a.daysToClose || 999) - (b.daysToClose || 999)
      return a.id.localeCompare(b.id)
    })
  }, [filters, sortBy])

  const closed = INITIAL_DATA.filter(r => r.status === 'Closed')
  const avgEffectiveness = Math.round(closed.reduce((s, r) => s + r.effectiveness, 0) / closed.length)
  const avgDays = Math.round(closed.reduce((s, r) => s + r.daysToClose, 0) / closed.length)
  const onTimeRate = Math.round((closed.length / INITIAL_DATA.filter(r => r.status !== 'Open').length) * 100)

  const exportCSV = () => {
    const headers = ['ID', 'Station', 'Category', 'Finding', 'Action', 'Target Date', 'Status', 'Effectiveness', 'Days to Close']
    const rows = filtered.map(r => [r.id, r.station, r.category, `"${r.finding}"`, `"${r.action}"`, r.targetDate, r.status, r.effectiveness ?? 'N/A', r.daysToClose ?? 'N/A'])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'corrective-actions.csv'; a.click()
  }

  const SelectFilter = ({ label, value, options, onChange }) => (
    <div>
      <label style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: '0.3rem' }}>
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '6px',
        color: 'var(--text-primary)', fontFamily: 'var(--font-jetbrains)', fontSize: '11px',
        padding: '0.35rem 0.65rem', cursor: 'pointer',
      }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'var(--font-dm-sans)' }}>
      <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
        // CORRECTIVE ACTION PLAN TRACKER
      </p>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Avg Effectiveness', value: `${avgEffectiveness}%`, color: '#22D4BC' },
          { label: 'On-Time Completion', value: `${onTimeRate}%`, color: '#22D4BC' },
          { label: 'Avg Days to Close', value: `${avgDays} days`, color: '#F4A535' },
          { label: 'Open Actions', value: INITIAL_DATA.filter(r => r.status === 'Open').length, color: '#6B8CFF' },
        ].map(m => (
          <div key={m.label} style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '0.85rem', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{m.label}</p>
            <p style={{ fontFamily: 'var(--font-syne)', fontSize: '1.3rem', fontWeight: 700, color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <SelectFilter label="STATION" value={filters.station} options={STATIONS} onChange={v => setFilters({ ...filters, station: v })} />
        <SelectFilter label="CATEGORY" value={filters.category} options={CATEGORIES} onChange={v => setFilters({ ...filters, category: v })} />
        <SelectFilter label="STATUS" value={filters.status} options={STATUSES} onChange={v => setFilters({ ...filters, status: v })} />
        <SelectFilter label="SORT BY" value={sortBy} options={['id', 'effectiveness', 'daysToClose']} onChange={setSortBy} />
        <button onClick={exportCSV} style={{
          fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.1em',
          padding: '0.4rem 0.85rem', background: 'var(--bg-surface)', color: 'var(--accent-cyan)',
          border: '1px solid var(--accent-cyan)', borderRadius: '6px', cursor: 'pointer',
        }}>
          ↓ EXPORT CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['ID', 'Station', 'Category', 'Finding', 'Status', 'Effectiveness', 'Days'].map(h => (
                <th key={h} style={{
                  padding: '0.5rem 0.75rem', textAlign: 'left',
                  fontFamily: 'var(--font-jetbrains)', fontSize: '9px',
                  letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 400,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg-surface)' }}>
                <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'var(--font-jetbrains)', fontSize: '10px', color: 'var(--accent-cyan)' }}>{row.id}</td>
                <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>{row.station}</td>
                <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>{row.category}</td>
                <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-primary)', maxWidth: '200px' }}>{row.finding}</td>
                <td style={{ padding: '0.6rem 0.75rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-jetbrains)', fontSize: '9px',
                    color: STATUS_COLOR[row.status], background: `${STATUS_COLOR[row.status]}15`,
                    padding: '0.2rem 0.4rem', borderRadius: '4px',
                  }}>
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: '0.6rem 0.75rem' }}>
                  {row.effectiveness ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: '40px', height: '3px', background: 'var(--border)', borderRadius: '2px' }}>
                        <div style={{ width: `${row.effectiveness}%`, height: '100%', background: row.effectiveness >= 90 ? '#22D4BC' : row.effectiveness >= 75 ? '#F4A535' : '#FF6B6B', borderRadius: '2px' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', color: 'var(--text-secondary)' }}>{row.effectiveness}%</span>
                    </div>
                  ) : <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>—</span>}
                </td>
                <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'var(--font-jetbrains)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                  {row.daysToClose ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Showing {filtered.length} of {INITIAL_DATA.length} records
        </p>
      </div>

      {/* Scalability Analysis */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <button onClick={() => setShowScalability(!showScalability)} style={{
          fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.1em',
          background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0,
        }}>
          {showScalability ? '▼' : '▶'} SCALABILITY ANALYSIS
        </button>
        {showScalability && (
          <div style={{ marginTop: '0.75rem' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
              The following corrective actions achieved 90%+ effectiveness and are candidates for network-wide deployment:
            </p>
            {INITIAL_DATA.filter(r => r.effectiveness >= 90).map(r => (
              <div key={r.id} style={{
                background: 'var(--bg-surface)', borderRadius: '8px', padding: '0.85rem',
                border: '1px solid var(--border)', borderLeft: '3px solid #22D4BC', marginBottom: '0.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--accent-cyan)' }}>{r.id} — {r.station}</span>
                  <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: '#22D4BC' }}>{r.effectiveness}% effective</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{r.action}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Originally addressing: {r.finding}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
