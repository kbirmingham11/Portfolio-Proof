import ApplicationTemplate from '@/components/ApplicationTemplate'
import RootCauseDashboard from './components/RootCauseDashboard'
import AuditSimulator from './components/AuditSimulator'
import ProcessImprover from './components/ProcessImprover'
import CAPTracker from './components/CAPTracker'
import ExecutiveBriefing from './components/ExecutiveBriefing'

const SKILLS_MATCH = [
  { skill: 'Root Cause Analysis', mine: 90, required: 90 },
  { skill: 'Audit Experience', mine: 85, required: 85 },
  { skill: 'Data Analysis', mine: 88, required: 85 },
  { skill: 'AI Tool Usage', mine: 92, required: 80 },
  { skill: 'Executive Presentations', mine: 82, required: 80 },
  { skill: 'Process Improvement', mine: 87, required: 85 },
]

const SECTIONS = [
  {
    id: 'the-role',
    label: 'The Role',
    title: 'What American Airlines Needs',
    description: 'The Analyst, Performance Assurance role requires root cause analysis, station audit experience, data-driven executive presentations, AI tool proficiency, and the ability to develop scalable corrective actions across the American Airlines network.',
    component: (
      <div style={{ padding: '1.5rem', fontFamily: 'var(--font-dm-sans)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            { skill: 'Root Cause Analysis', proof: 'Deliverable 1 — Interactive RCA Dashboard' },
            { skill: 'Audit & Observation', proof: 'Deliverable 2 — Audit Simulator' },
            { skill: 'AI Tool Proficiency', proof: 'Deliverable 3 — Live Claude API Integration' },
            { skill: 'Data Management', proof: 'Deliverable 4 — CAP Tracker with CSV Export' },
            { skill: 'Executive Presentations', proof: 'Deliverable 5 — Briefing Generator' },
            { skill: 'Process Improvement', proof: 'All deliverables — end to end' },
          ].map(item => (
            <div key={item.skill} style={{
              background: 'var(--bg-surface)', borderRadius: '8px', padding: '0.85rem',
              border: '1px solid var(--border)',
            }}>
              <p style={{ fontFamily: 'var(--font-syne)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                {item.skill}
              </p>
              <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', color: 'var(--accent-cyan)' }}>
                {item.proof}
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'approach',
    label: 'My Approach',
    title: 'How I Would Approach Day One',
    description: 'Performance Assurance is fundamentally about closing the loop between observation and improvement. My approach centers on three principles: make the invisible visible through data, make findings actionable through prioritization, and make solutions scalable through documentation.',
    component: (
      <div style={{ padding: '1.5rem', fontFamily: 'var(--font-dm-sans)' }}>
        {[
          {
            phase: '30 Days',
            title: 'Observe & Baseline',
            items: ['Complete station familiarization at assigned hubs', 'Audit existing CAP backlog and close rate trends', 'Establish personal observation cadence and reporting templates'],
          },
          {
            phase: '60 Days',
            title: 'Identify & Document',
            items: ['Complete first full audit cycle with structured findings', 'Map recurring issues across stations for pattern recognition', 'Build relationships with station managers and frontline crews'],
          },
          {
            phase: '90 Days',
            title: 'Recommend & Scale',
            items: ['Present first quarterly findings to leadership', 'Identify top 3 corrective actions for network-wide deployment', 'Propose process improvements with measurable success criteria'],
          },
        ].map(p => (
          <div key={p.phase} style={{
            marginBottom: '1rem', padding: '1rem',
            background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                fontFamily: 'var(--font-jetbrains)', fontSize: '10px', letterSpacing: '0.1em',
                color: 'var(--accent-cyan)', background: '#22D4BC15', border: '1px solid #22D4BC30',
                borderRadius: '6px', padding: '0.3rem 0.6rem', whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {p.phase}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{p.title}</p>
                {p.items.map(item => (
                  <p key={item} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '0.25rem', paddingLeft: '0.75rem', borderLeft: '2px solid var(--border)' }}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'deliverable-1',
    label: '① RCA Dashboard',
    title: 'Root Cause Analysis Dashboard',
    description: 'Interactive analysis of gate turnaround delays using an Ishikawa diagram, Pareto chart, and 5 Whys walkthrough. Toggle between Executive Summary and Detailed Analysis views.',
    component: <RootCauseDashboard />,
  },
  {
    id: 'deliverable-2',
    label: '② Audit Simulator',
    title: 'Performance Assurance Audit Simulator',
    description: 'An 8-checkpoint station audit scenario. Make assessment calls on real operational situations, then see the rationale and your accuracy score.',
    component: <AuditSimulator />,
  },
  {
    id: 'deliverable-3',
    label: '③ AI Process Analyzer',
    title: 'AI-Powered Process Improvement Identifier',
    description: 'Paste any operational workflow and Claude AI identifies inefficiencies, suggests improvements with estimated impact, and flags risk factors — live.',
    component: <ProcessImprover />,
  },
  {
    id: 'deliverable-4',
    label: '④ CAP Tracker',
    title: 'Corrective Action Effectiveness Tracker',
    description: 'Filter, sort, and analyze 15 corrective actions across 6 stations. Includes scalability analysis and CSV export — the spreadsheet equivalent, built beyond spreadsheets.',
    component: <CAPTracker />,
  },
  {
    id: 'deliverable-5',
    label: '⑤ Exec Briefing',
    title: 'Executive Briefing Generator',
    description: 'A 4-slide briefing deck with audience-level toggle (C-Suite, VP, Director), speaker notes, and red/yellow/green status indicators built from operational metrics.',
    component: <ExecutiveBriefing />,
  },
  {
    id: 'background',
    label: 'Background',
    title: 'Relevant Experience',
    description: 'How my background maps to what this role requires.',
    component: (
      <div style={{ padding: '1.5rem', fontFamily: 'var(--font-dm-sans)' }}>
        {[
          {
            theirs: 'Root cause analysis & corrective action',
            mine: 'Systems administration requires constant RCA — diagnosing failures, tracing causes through layered infrastructure, and implementing permanent fixes rather than workarounds.',
          },
          {
            theirs: 'Audit & observation methodology',
            mine: 'Security compliance audits, infrastructure reviews, and change management processes all require structured observation, documentation, and follow-up — the same discipline as station audits.',
          },
          {
            theirs: 'AI tool proficiency',
            mine: 'Actively building AI-integrated workflows, including this portfolio — using Claude API for process analysis, automation scripting, and productivity tooling.',
          },
          {
            theirs: 'Data analysis & executive communication',
            mine: 'Translating system metrics, incident data, and performance trends into clear recommendations for non-technical stakeholders is a core part of IT operations.',
          },
          {
            theirs: 'Travel readiness',
            mine: 'Open to regular domestic travel. Remote-first work has sharpened independence and structured self-management — skills that translate directly to field audit work.',
          },
        ].map(item => (
          <div key={item.theirs} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
            marginBottom: '0.75rem', padding: '0.85rem',
            background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border)',
          }}>
            <div>
              <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>THEY NEED</p>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{item.theirs}</p>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>I BRING</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.mine}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
]

export default function AAPerformanceAnalyst() {
  return (
    <ApplicationTemplate
      companyName="American Airlines"
      jobTitle="Analyst, Performance Assurance"
      postingDate="2025-07-15"
      accentColor="#0078D4"
      skillsMatch={SKILLS_MATCH}
      sections={SECTIONS}
    />
  )
}
