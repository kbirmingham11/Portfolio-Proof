'use client'

import './globals.css'
import { useState, useEffect } from 'react'

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark'
    setTheme(saved)
    document.documentElement.classList.toggle('dark', saved === 'dark')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>Kameron Birmingham — Proof of Competence</title>
        <meta name="description" content="Not a resume. A proof-of-competence engine. Working demonstrations of the skills every role requires." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div
          style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 50 }}
        >
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-secondary)',
              padding: '0.4rem 0.85rem',
              borderRadius: '999px',
              fontSize: '11px',
              fontFamily: 'var(--font-jetbrains)',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'all 0.2s ease',
            }}
          >
            {theme === 'dark' ? '◐ LIGHT' : '◑ DARK'}
          </button>
        </div>
        {children}
      </body>
    </html>
  )
}
