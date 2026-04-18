'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

/**
 * ApplicationTemplate
 *
 * Props:
 *   companyName   {string}
 *   jobTitle      {string}
 *   postingDate   {string}  e.g. "2025-07-15"
 *   accentColor   {string}  hex brand color
 *   skillsMatch   {Array}   [{ skill, mine, required }]  — numbers 0–100
 *   sections      {Array}   [{ id, label, title, description, component }]
 */
export default function ApplicationTemplate({
  companyName,
  jobTitle,
  postingDate,
  accentColor = '#22D4BC',
  skillsMatch = [],
  sections = [],
}) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sectionRefs = useRef({})

  // Intersection observer for active section tracking
  useEffect(() => {
    const observers = []
    sections.forEach(({ id }) => {
      const el = sectionRefs.current[id]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [sections])

  const date = new Date(postingDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>

      {/* Grid background */}
      <div className="grid-bg" style={{
        position: 'fixed', inset: 0, opacity: 0.5, pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border)',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(8px)',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-jetbrains)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          letterSpacing: '0.1em',
        }}>
          ← KAMERONBIRMINGHAM.DEV
        </Link>

        <div style={{ textAlign: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            display: 'block',
          }}>
            {companyName}
          </span>
          <span style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '9px',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}>
            {jobTitle}
          </span>
        </div>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '0.3rem 0.65rem',
            cursor: 'pointer',
            display: 'none',  // shown on mobile via CSS
          }}
          className="mobile-nav-toggle"
        >
          ≡ NAV
        </button>
      </header>

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex',
        paddingTop: '60px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>

        {/* ── Sticky sidebar ───────────────────────────────────────────────── */}
        <aside style={{
          width: '220px',
          flexShrink: 0,
          position: 'sticky',
          top: '60px',
          height: 'calc(100vh - 60px)',
          overflowY: 'auto',
          padding: '2rem 1rem 2rem 1.5rem',
          borderRight: '1px solid var(--border)',
        }}>
          <p style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '9px',
            letterSpacing: '0.2em',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem',
          }}>// SECTIONS</p>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '13px',
                  color: activeSection === id ? accentColor : 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  borderLeft: `2px solid ${activeSection === id ? accentColor : 'transparent'}`,
                  background: activeSection === id ? 'var(--bg-surface)' : 'transparent',
                  transition: 'all 0.2s ease',
                  display: 'block',
                  lineHeight: 1.3,
                }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Skills match mini */}
          {skillsMatch.length > 0 && (
            <div style={{ marginTop: '2.5rem' }}>
              <p style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
              }}>// SKILL MATCH</p>

              {skillsMatch.slice(0, 5).map(({ skill, mine, required }) => {
                const match = Math.min((mine / required) * 100, 100)
                return (
                  <div key={skill} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: 'var(--text-muted)' }}>
                        {skill.toUpperCase().slice(0, 12)}
                      </span>
                      <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '9px', color: accentColor }}>
                        {Math.round(match)}%
                      </span>
                    </div>
                    <div style={{ height: '2px', background: 'var(--border)', borderRadius: '1px' }}>
                      <div style={{
                        height: '100%',
                        width: `${match}%`,
                        background: accentColor,
                        borderRadius: '1px',
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </aside>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main style={{ flex: 1, padding: '2.5rem 3rem 5rem', minWidth: 0 }}>

          {/* Hero header */}
          <div style={{
            marginBottom: '3.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: accentColor,
                boxShadow: `0 0 12px ${accentColor}60`,
              }} className="status-pulse" />
              <span style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: accentColor,
              }}>
                PROOF OF WORK — {date.toUpperCase()}
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-syne)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: '0.75rem',
            }}>
              {companyName}
            </h1>
            <h2 style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '1.15rem',
              fontWeight: 300,
              color: 'var(--text-secondary)',
            }}>
              {jobTitle}
            </h2>
          </div>

          {/* Sections */}
          {sections.map(({ id, title, description, component }) => (
            <section
              key={id}
              id={id}
              ref={el => { sectionRefs.current[id] = el }}
              style={{ marginBottom: '5rem' }}
            >
              <div style={{ marginBottom: '1.75rem' }}>
                <p style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '9px',
                  letterSpacing: '0.25em',
                  color: 'var(--text-muted)',
                  marginBottom: '0.6rem',
                }}>
                  // {id.toUpperCase().replace(/-/g, '_')}
                </p>
                <h3 style={{
                  fontFamily: 'var(--font-syne)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.6rem',
                }}>
                  {title}
                </h3>
                {description && (
                  <p style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '15px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    maxWidth: '640px',
                  }}>
                    {description}
                  </p>
                )}
              </div>

              {/* The deliverable component renders here */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                {component}
              </div>
            </section>
          ))}

          {/* Let's Connect CTA */}
          <section style={{
            background: 'var(--bg-secondary)',
            border: `1px solid ${accentColor}30`,
            borderRadius: '16px',
            padding: '2.5rem',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: accentColor,
              marginBottom: '1rem',
            }}>
              // LETS_CONNECT
            </p>
            <h3 style={{
              fontFamily: 'var(--font-syne)',
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
            }}>
              Ready to talk?
            </h3>
            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '15px',
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              maxWidth: '480px',
              margin: '0 auto 2rem',
            }}>
              You just saw working proof of every skill this role requires.
              Let's make it official.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://www.linkedin.com/in/kameron-birmingham11"
                target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  color: '#050A14',
                  background: accentColor,
                  borderRadius: '999px',
                  padding: '0.65rem 1.5rem',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                ↗ CONNECT ON LINKEDIN
              </a>
              <a
                href="mailto:KameronBirmingham@gmail.com"
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '999px',
                  padding: '0.65rem 1.5rem',
                  textDecoration: 'none',
                }}
              >
                ↗ EMAIL ME
              </a>
            </div>
          </section>

        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-nav-toggle { display: block !important; }
          aside { display: none; }
          main { padding: 1.5rem 1.25rem 4rem !important; }
        }
      `}</style>
    </div>
  )
}
