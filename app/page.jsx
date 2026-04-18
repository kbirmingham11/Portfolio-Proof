'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Data: Showcase applications ────────────────────────────────────────────
// Add a new entry here each time you apply to a role.
const SHOWCASES = [
  {
    slug: 'aa-performance-analyst',
    company: 'American Airlines',
    role: 'Analyst, Performance Assurance',
    appliedDate: '2025-07-15',
    status: 'active',       // active | interviewing | closed | archived
    tags: ['Root Cause Analysis', 'Audit', 'Data Viz', 'AI Tools'],
    color: '#0078D4',       // brand accent for the card
  },
  // ─── Template: copy & fill for each new role ───────────────────────────
  // {
  //   slug: 'company-role-slug',
  //   company: 'Company Name',
  //   role: 'Job Title',
  //   appliedDate: 'YYYY-MM-DD',
  //   status: 'active',
  //   tags: ['Skill 1', 'Skill 2'],
  //   color: '#HEXCODE',
  // },
]

const STATUS_CONFIG = {
  active:       { label: 'ACTIVE',       dot: '#22D4BC' },
  interviewing: { label: 'INTERVIEWING', dot: '#F4A535' },
  closed:       { label: 'CLOSED',       dot: '#4A6A8A' },
  archived:     { label: 'ARCHIVED',     dot: '#2A3A4A' },
}

const EXPERTISE = [
  { label: 'Systems Administration',   pct: 92 },
  { label: 'Remote Infrastructure Mgmt', pct: 88 },
  { label: 'Network Configuration',    pct: 85 },
  { label: 'Cloud & Virtualization',   pct: 80 },
  { label: 'Security & Compliance',    pct: 78 },
  { label: 'Automation & Scripting',   pct: 83 },
]

// ─── Component ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState(null)

  const now = new Date()

  return (
    <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Grid background */}
      <div className="grid-bg" style={{
        position: 'fixed', inset: 0, opacity: 0.6, pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Radial glow top-left */}
      <div style={{
        position: 'fixed', top: '-200px', left: '-200px',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(34,212,188,0.07) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header style={{ paddingTop: '5rem', paddingBottom: '4rem', borderBottom: '1px solid var(--border)' }}>
          <div className="animate-slide-up">
            <p style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: 'var(--accent-cyan)',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}>
              ▸ kameronbirmingham.dev / proof-of-competence
            </p>

            <h1 style={{
              fontFamily: 'var(--font-syne)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}>
              KAMERON<br />
              <span style={{ color: 'var(--accent-cyan)' }}>BIRMINGHAM</span>
            </h1>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '280px' }}>
                <p style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '1.15rem',
                  fontWeight: 300,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  maxWidth: '520px',
                }}>
                  Systems administrator and remote infrastructure engineer.
                  Every page here is a <em style={{ color: 'var(--text-primary)', fontStyle: 'normal', fontWeight: 500 }}>working demonstration</em> of the
                  skills a role requires — not a list of them.
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
                  <a
                    href="https://www.linkedin.com/in/kameron-birmingham11"
                    target="_blank" rel="noopener noreferrer"
                    style={linkBtnStyle}
                  >
                    ↗ LinkedIn
                  </a>
                  <a href="mailto:your@email.com" style={linkBtnStyle}>
                    ↗ Contact
                  </a>
                  <a href="#showcases" style={{ ...linkBtnStyle, borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
                    View Showcases ↓
                  </a>
                </div>
              </div>

              {/* Live stats bar */}
              <div style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                paddingLeft: '2rem',
                borderLeft: '1px solid var(--border)',
              }}>
                <StatLine label="SHOWCASES" value={SHOWCASES.length} />
                <StatLine label="ACTIVE" value={SHOWCASES.filter(s => s.status === 'active').length} accent />
                <StatLine label="AVAILABLE" value="REMOTE" />
                <StatLine label="FOCUS" value="CONTRACT" />
                <StatLine
                  label="UPDATED"
                  value={now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                />
              </div>
            </div>
          </div>
        </header>

        {/* ── Expertise Bars ─────────────────────────────────────────────── */}
        <section style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem', borderBottom: '1px solid var(--border)' }}>
          <SectionLabel>Core Competencies</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            {EXPERTISE.map((item, i) => (
              <div key={item.label} className={`animate-slide-up animate-delay-${i + 1}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {item.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', color: 'var(--accent-cyan)' }}>
                    {item.pct}%
                  </span>
                </div>
                <div style={{
                  height: '3px',
                  background: 'var(--border)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${item.pct}%`,
                    background: `linear-gradient(90deg, var(--accent-cyan), #00A88E)`,
                    borderRadius: '2px',
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Application Showcases ──────────────────────────────────────── */}
        <section id="showcases" style={{ paddingTop: '3.5rem', paddingBottom: '5rem' }}>
          <SectionLabel>Application Showcases</SectionLabel>
          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '14px',
            color: 'var(--text-muted)',
            marginTop: '0.5rem',
            marginBottom: '2rem',
            fontFamily: 'var(--font-jetbrains)',
            letterSpacing: '0.02em',
          }}>
            Each card below is a live proof-of-work page built for that specific role.
          </p>

          {SHOWCASES.length === 0 ? (
            <EmptyState />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem',
            }}>
              {SHOWCASES.map((s, i) => (
                <ShowcaseCard
                  key={s.slug}
                  showcase={s}
                  isHovered={hoveredCard === s.slug}
                  onHover={() => setHoveredCard(s.slug)}
                  onLeave={() => setHoveredCard(null)}
                  delay={i + 1}
                />
              ))}
              <AddNewCard />
            </div>
          )}
        </section>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '2rem',
          paddingBottom: '3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', color: 'var(--text-muted)' }}>
            © {now.getFullYear()} KAMERON BIRMINGHAM — PROOF OF COMPETENCE ENGINE
          </span>
          <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent-cyan)' }}>●</span> OPEN TO REMOTE CONTRACT WORK
          </span>
        </footer>

      </div>
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: 'var(--font-jetbrains)',
      fontSize: '10px',
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
    }}>
      // {children}
    </p>
  )
}

function StatLine({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem' }}>
      <span style={{ letterSpacing: '0.1em' }}>{label}</span>
      <span style={{ color: accent ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
        {value}
      </span>
    </div>
  )
}

function ShowcaseCard({ showcase, isHovered, onHover, onLeave, delay }) {
  const status = STATUS_CONFIG[showcase.status] || STATUS_CONFIG.active
  const date = new Date(showcase.appliedDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <Link
      href={`/applications/${showcase.slug}`}
      style={{ textDecoration: 'none' }}
      className={`animate-slide-up animate-delay-${delay}`}
    >
      <div
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        style={{
          background: 'var(--bg-secondary)',
          border: `1px solid ${isHovered ? 'var(--border-strong)' : 'var(--border)'}`,
          borderRadius: '12px',
          padding: '1.5rem',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top color bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: isHovered ? showcase.color : 'transparent',
          transition: 'background 0.25s ease',
        }} />

        {/* Status indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              className={showcase.status === 'active' ? 'status-pulse' : ''}
              style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: status.dot,
              }}
            />
            <span style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: showcase.status === 'active' ? 'var(--accent-cyan)' : 'var(--text-muted)',
            }}>
              {status.label}
            </span>
          </div>
          <span style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '10px',
            color: 'var(--text-muted)',
          }}>
            {date}
          </span>
        </div>

        {/* Company & role */}
        <h3 style={{
          fontFamily: 'var(--font-syne)',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.3rem',
          lineHeight: 1.2,
        }}>
          {showcase.company}
        </h3>
        <p style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginBottom: '1.25rem',
        }}>
          {showcase.role}
        </p>

        {/* Skill tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {showcase.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '9px',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '0.2rem 0.5rem',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA row */}
        <div style={{
          marginTop: '1.25rem',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: isHovered ? 'var(--accent-cyan)' : 'var(--text-muted)',
            transition: 'color 0.2s ease',
          }}>
            VIEW PROOF OF WORK →
          </span>
        </div>
      </div>
    </Link>
  )
}

function AddNewCard() {
  return (
    <div style={{
      background: 'transparent',
      border: '1px dashed var(--border)',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      gap: '0.75rem',
    }}>
      <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '24px', color: 'var(--border-strong)' }}>+</span>
      <span style={{
        fontFamily: 'var(--font-jetbrains)',
        fontSize: '10px',
        letterSpacing: '0.15em',
        color: 'var(--text-muted)',
        textAlign: 'center',
        lineHeight: 1.8,
      }}>
        NEXT APPLICATION<br />SHOWCASE GOES HERE
      </span>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '5rem 2rem',
      border: '1px dashed var(--border)',
      borderRadius: '12px',
    }}>
      <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '13px', color: 'var(--text-muted)' }}>
        No showcases yet. Add your first role to the SHOWCASES array above.
      </p>
    </div>
  )
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const linkBtnStyle = {
  display: 'inline-block',
  fontFamily: 'var(--font-jetbrains)',
  fontSize: '11px',
  letterSpacing: '0.1em',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border-strong)',
  borderRadius: '999px',
  padding: '0.45rem 1rem',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
}
