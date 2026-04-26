'use client'

import { useState } from 'react'

const CHECKPOINTS = [
  {
    id: 1,
    scenario: 'Ramp agent observed not wearing high-visibility vest during aircraft pushback operation.',
    options: ['No issue — vest is optional during pushback', 'Minor finding — suggest improvement', 'Critical finding — immediate corrective action required', 'Major finding — document and escalate'],
    correct: 2,
    severity: 'Critical',
    rationale: 'High-visibility vests are mandatory PPE during all ramp operations near aircraft. This is a critical safety violation requiring immediate corrective action and retraining.',
  },
  {
    id: 2,
    scenario: 'Gate agent verbally confirms wheelchair assistance request with passenger but does not log it in the system.',
    options: ['Acceptable — verbal confirmation is sufficient', 'Observation — recommend documentation practice', 'Major finding — policy requires system logging', 'Critical finding — ADA violation'],
    correct: 2,
    severity: 'Major',
    rationale: 'Accessibility service requests must be logged in the system to ensure continuity across handoffs. Verbal-only confirmations risk service failures.',
  },
  {
    id: 3,
    scenario: 'Baggage handlers loading cargo that visually exceeds weight placards without verifying manifest.',
    options: ['Observation only — placards are estimates', 'Minor finding — suggest manifest check habit', 'Critical finding — weight and balance violation risk', 'No issue — handlers are experienced'],
    correct: 2,
    severity: 'Critical',
    rationale: 'Weight and balance verification is non-negotiable for flight safety. Loading without manifest verification is a critical finding regardless of crew experience.',
  },
  {
    id: 4,
    scenario: 'Ground crew turnaround time averaged 28 minutes vs. 20-minute target across 6 observed flights.',
    options: ['No action needed — within acceptable variance', 'Observation — monitor for trend', 'Major finding — systemic process issue', 'Minor finding — individual performance issue'],
    correct: 2,
    severity: 'Major',
    rationale: 'Consistent 40% over-target across 6 flights indicates a systemic process or staffing issue, not random variance. Requires root cause analysis.',
  },
  {
    id: 5,
    scenario: 'De-icing crew completed procedure but did not perform required post-de-icing inspection walk.',
    options: ['Observation — walk is best practice but optional', 'Minor finding — remind crew of best practice', 'Critical finding — mandatory safety procedure skipped', 'No issue — de-icing was completed correctly'],
    correct: 2,
    severity: 'Critical',
    rationale: 'Post-de-icing inspection is a mandatory safety procedure to confirm fluid coverage and detect any issues before departure clearance.',
  },
  {
    id: 6,
    scenario: 'Station manager\'s daily briefing notes were 4 days old and not updated with current operational notices.',
    options: ['Critical — safety information may be outdated', 'No issue — briefings are weekly', 'Major finding — communication protocol failure', 'Observation — suggest daily update reminder'],
    correct: 2,
    severity: 'Major',
    rationale: 'Operational notices can include time-sensitive safety and procedure changes. Outdated briefings create risk of crews operating on superseded information.',
  },
  {
    id: 7,
    scenario: 'Two ground crew members observed using personal cell phones while directing aircraft taxi.',
    options: ['Observation — phones are common but not ideal', 'No issue — brief use is acceptable', 'Critical — distracted operations near aircraft', 'Minor — informal coaching recommended'],
    correct: 2,
    severity: 'Critical',
    rationale: 'Any distraction during aircraft movement operations is a critical safety violation. Cell phone use while directing taxi creates blind spots and reaction time delays.',
  },
  {
    id: 8,
    scenario: 'Corrective action from previous audit (fuel spill cleanup procedure) has been posted but crew cannot locate the updated SOP binder.',
    options: ['Minor — document location issue only', 'Observation — suggest better binder placement', 'Major — corrective action not effectively implemented', 'No issue — posting is sufficient'],
    correct: 2,
    severity: 'Major',
    rationale: 'A corrective action is only effective if staff can access and reference it. Inaccessible SOPs mean the corrective action has not been successfully implemented.',
  },
]

const SEVERITY_COLOR = {
  Critical: '#FF6B6B',
  Major: '#F4A535',
  Minor: '#22D4BC',
  Observation: '#6B8CFF',
}

export default function AuditSimulator() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [complete, setComplete] = useState(false)

  const checkpoint = CHECKPOINTS[current]
  const isAnswered = answers[checkpoint.id] !== undefined

  const handleSelect = (idx) => {
    if (isAnswered) return
    setSelected(idx)
  }

  const handleConfirm = () => {
    if (selected === null) return
    setAnswers({ ...answers, [checkpoint.id]: selected })
    setShowResult(true)
  }

  const handleNext = () => {
    if (current < CHECKPOINTS.length - 1) {
      setCurrent(current + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      setComplete(true)
    }
  }

  const score = Object.entries(answers).filter(([id, ans]) => {
    const cp = CHECKPOINTS.find(c => c.id === parseInt(id))
    return ans === cp.correct
  }).length

  const accuracy = Math.round((score / CHECKPOINTS.length) * 100)

  const findings = CHECKPOINTS.map(cp => ({
    ...cp,
    userAnswer: answers[cp.id],
    correct: answers[cp.id] === cp.correct,
  }))

  const criticalCount = findings.filter(f => f.severity === 'Critical').length
  const majorCount = findings.filter(f => f.severity === 'Major').length

  if (complete) {
    return (
      <div style={{ padding: '1.5rem', fontFamily: 'var(--font-dm-sans)' }}>
        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
          // AUDIT COMPLETE — STATION REPORT
        </p>

        {/* Score */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Assessment Accuracy', value: `${accuracy}%`, color: accuracy >= 80 ? '#22D4BC' : '#F4A535' },
            { label: 'Critical Findings', value: criticalCount, color: '#FF6B6B' },
            { label: 'Major Findings', value: majorCount, color: '#F4A535' },
            { label: 'Compliance Score', value: `${Math.round(100 - (criticalCount * 15 + majorCount * 7))}%`, color: '#6B8CFF' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '0.85rem', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--font-syne)', fontSize: '1.4rem', fontWeight: 700, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Findings table */}
        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          // FINDINGS BY SEVERITY
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {findings.map(f => (
            <div key={f.id} style={{
              background: 'var(--bg-surface)', borderRadius: '8px', padding: '0.85rem',
              border: `1px solid ${f.correct ? 'var(--border)' : '#FF6B6B30'}`,
              borderLeft: `3px solid ${SEVERITY_COLOR[f.severity]}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{
                  fontFamily: 'var(--font-jetbrains)', fontSize: '9px',
                  color: SEVERITY_COLOR[f.severity], letterSpacing: '0.1em',
                }}>
                  {f.severity.toUpperCase()}
                </span>
                <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: f.correct ? '#22D4BC' : '#FF6B6B' }}>
                  {f.correct ? '✓ CORRECT' : '✗ INCORRECT'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{f.scenario}</p>
            </div>
          ))}
        </div>

        <button onClick={() => { setCurrent(0); setAnswers({}); setSelected(null); setShowResult(false); setComplete(false) }}
          style={{
            fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.1em',
            padding: '0.5rem 1rem', background: 'var(--accent-cyan)', color: '#050A14',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
          }}>
          RESTART AUDIT
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'var(--font-dm-sans)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--accent-cyan)' }}>
          // CHECKPOINT {current + 1} OF {CHECKPOINTS.length}
        </p>
        <div style={{ display: 'flex', gap: '4px' }}>
          {CHECKPOINTS.map((_, i) => (
            <div key={i} style={{
              width: '20px', height: '4px', borderRadius: '2px',
              background: i < current ? 'var(--accent-cyan)' : i === current ? '#F4A535' : 'var(--border)',
            }} />
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '1rem', border: '1px solid var(--border)', marginBottom: '1rem' }}>
        <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
          OBSERVATION
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>{checkpoint.scenario}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {checkpoint.options.map((opt, i) => {
          let bg = 'var(--bg-secondary)'
          let border = 'var(--border)'
          let color = 'var(--text-secondary)'
          if (selected === i && !showResult) { bg = 'var(--bg-surface)'; border = 'var(--accent-cyan)'; color = 'var(--text-primary)' }
          if (showResult && i === checkpoint.correct) { bg = '#22D4BC10'; border = '#22D4BC'; color = '#22D4BC' }
          if (showResult && selected === i && i !== checkpoint.correct) { bg = '#FF6B6B10'; border = '#FF6B6B'; color = '#FF6B6B' }

          return (
            <button key={i} onClick={() => handleSelect(i)} style={{
              background: bg, border: `1px solid ${border}`, borderRadius: '8px',
              padding: '0.75rem 1rem', textAlign: 'left', cursor: isAnswered ? 'default' : 'pointer',
              color, fontSize: '13px', fontFamily: 'var(--font-dm-sans)', lineHeight: 1.4,
              transition: 'all 0.2s ease',
            }}>
              {opt}
            </button>
          )
        })}
      </div>

      {showResult && (
        <div style={{ background: '#22D4BC08', border: '1px solid #22D4BC30', borderRadius: '8px', padding: '0.85rem', marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: '#22D4BC', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
            BEST PRACTICE RATIONALE
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{checkpoint.rationale}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {!showResult ? (
          <button onClick={handleConfirm} disabled={selected === null} style={{
            fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.1em',
            padding: '0.5rem 1rem', background: selected !== null ? 'var(--accent-cyan)' : 'var(--border)',
            color: selected !== null ? '#050A14' : 'var(--text-muted)',
            border: 'none', borderRadius: '6px', cursor: selected !== null ? 'pointer' : 'not-allowed',
          }}>
            SUBMIT ASSESSMENT
          </button>
        ) : (
          <button onClick={handleNext} style={{
            fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.1em',
            padding: '0.5rem 1rem', background: 'var(--accent-cyan)', color: '#050A14',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
          }}>
            {current < CHECKPOINTS.length - 1 ? 'NEXT CHECKPOINT →' : 'VIEW REPORT →'}
          </button>
        )}
      </div>
    </div>
  )
}
