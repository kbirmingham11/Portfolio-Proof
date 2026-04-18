/**
 * lib/notifications.js
 * ─────────────────────────────────────────────────────────────────────────────
 * LinkedIn Opportunity Notification System
 * Kameron Birmingham | kameronbirmingham.dev
 *
 * HOW IT WORKS:
 *   1. A Vercel Cron Job calls /api/notifications/check every N hours
 *   2. We pull LinkedIn job alerts via RSS (no API key needed)
 *   3. Each result is scored against YOUR STANDARDS below
 *   4. If it passes, an email notification is sent via Resend
 *   5. Seen jobs are cached to avoid duplicate alerts
 *
 * SETUP:
 *   1. npm install resend
 *   2. Get a free API key at resend.com
 *   3. Add RESEND_API_KEY to your Vercel environment variables
 *   4. Add NOTIFICATION_EMAIL to your Vercel environment variables
 *   5. Deploy — Vercel Cron will run automatically
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── YOUR STANDARDS ──────────────────────────────────────────────────────────
// Customize these to reflect what YOU will and won't accept.
export const MY_STANDARDS = {
  // Roles you're open to (case-insensitive, partial match)
  targetTitles: [
    'systems administrator',
    'sysadmin',
    'it administrator',
    'network administrator',
    'infrastructure engineer',
    'systems engineer',
    'cloud administrator',
    'devops engineer',
    'site reliability',
    'it specialist',
    'linux administrator',
    'windows administrator',
    'remote systems',
  ],

  // Must contain at least one of these (remote filter)
  requiredKeywords: [
    'remote',
    'work from home',
    'wfh',
    'distributed',
    'fully remote',
  ],

  // Reject if ANY of these appear
  dealbreakers: [
    'on-site only',
    'must be local',
    'no remote',
    'in-office required',
    'relocation required',
    'security clearance required',  // remove if you have clearance
  ],

  // Minimum pay (set to 0 to disable filter)
  minSalaryUSD: 60000,

  // Seniority levels acceptable
  acceptedLevels: [
    'mid',
    'senior',
    'lead',
    'principal',
    'staff',
    'contract',
    'freelance',
    '',   // unspecified
  ],

  // Employment types
  acceptedTypes: [
    'contract',
    'full-time',
    'part-time',
    'freelance',
    'temporary',
  ],
}

// ─── LinkedIn RSS Feed URLs ───────────────────────────────────────────────────
// LinkedIn exposes job search results as RSS. Build your search URLs here.
// Format: linkedin.com/jobs/search/?keywords=KEYWORD&f_WT=2 (f_WT=2 = remote)
export const LINKEDIN_RSS_FEEDS = [
  'https://www.linkedin.com/jobs/search/?keywords=systems+administrator+remote&f_WT=2&f_JT=C&f_JT=F',
  'https://www.linkedin.com/jobs/search/?keywords=network+administrator+remote&f_WT=2',
  'https://www.linkedin.com/jobs/search/?keywords=infrastructure+engineer+remote+contract&f_WT=2',
  'https://www.linkedin.com/jobs/search/?keywords=sysadmin+remote&f_WT=2',
]

// ─── Scoring function ─────────────────────────────────────────────────────────
/**
 * Score a job posting against MY_STANDARDS.
 * Returns { pass: boolean, score: number, reasons: string[] }
 */
export function scoreJob(job) {
  const reasons = []
  let score = 0
  const text = `${job.title} ${job.description} ${job.location}`.toLowerCase()

  // Title match
  const titleMatch = MY_STANDARDS.targetTitles.some(t =>
    job.title.toLowerCase().includes(t)
  )
  if (titleMatch) { score += 40; reasons.push('✓ Title match') }
  else { reasons.push('✗ Title mismatch'); return { pass: false, score, reasons } }

  // Remote keyword
  const isRemote = MY_STANDARDS.requiredKeywords.some(k => text.includes(k))
  if (isRemote) { score += 30; reasons.push('✓ Remote confirmed') }
  else { reasons.push('✗ Not remote'); return { pass: false, score, reasons } }

  // Dealbreakers
  const hasDealbreaker = MY_STANDARDS.dealbreakers.some(d => text.includes(d))
  if (hasDealbreaker) { reasons.push('✗ Dealbreaker found'); return { pass: false, score, reasons } }
  else { score += 10; reasons.push('✓ No dealbreakers') }

  // Salary check (if detectable)
  const salaryMatch = text.match(/\$?([\d,]+)k?/g)
  if (salaryMatch) {
    const amounts = salaryMatch.map(s => {
      const n = parseInt(s.replace(/[$,k]/g, ''))
      return s.includes('k') ? n * 1000 : n
    }).filter(n => n > 10000)
    const maxSalary = Math.max(...amounts)
    if (maxSalary >= MY_STANDARDS.minSalaryUSD) {
      score += 15
      reasons.push(`✓ Salary ~$${(maxSalary / 1000).toFixed(0)}k`)
    } else {
      reasons.push(`⚠ Salary may be low (~$${(maxSalary / 1000).toFixed(0)}k)`)
    }
  } else {
    score += 5  // no salary listed — don't penalize
    reasons.push('~ Salary not listed')
  }

  // Contract/type bonus
  const isContract = ['contract', 'freelance'].some(t => text.includes(t))
  if (isContract) { score += 10; reasons.push('✓ Contract role') }

  return { pass: score >= 70, score, reasons }
}

// ─── Email formatter ──────────────────────────────────────────────────────────
export function formatNotificationEmail(jobs) {
  const listItems = jobs.map(({ job, score, reasons }) => `
    <div style="margin-bottom:24px;padding:16px;background:#081220;border-radius:8px;border-left:3px solid #22D4BC;">
      <h3 style="margin:0 0 4px;font-family:monospace;color:#E2EBF6;">${job.title}</h3>
      <p style="margin:0 0 8px;color:#6A8BA8;font-size:13px;">${job.company} • ${job.location}</p>
      <p style="margin:0 0 8px;color:#22D4BC;font-family:monospace;font-size:12px;">MATCH SCORE: ${score}/100</p>
      <p style="margin:0;font-size:12px;color:#4A6A8A;">${reasons.join(' &nbsp;|&nbsp; ')}</p>
      <a href="${job.url}" style="display:inline-block;margin-top:12px;color:#22D4BC;font-family:monospace;font-size:12px;">VIEW ON LINKEDIN →</a>
    </div>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <body style="background:#050A14;color:#E2EBF6;font-family:sans-serif;padding:32px;max-width:600px;margin:0 auto;">
      <p style="font-family:monospace;font-size:11px;letter-spacing:0.2em;color:#22D4BC;margin-bottom:8px;">
        ▸ KAMERONBIRMINGHAM.DEV / OPPORTUNITY ALERT
      </p>
      <h1 style="font-size:24px;font-weight:800;margin:0 0 8px;color:#E2EBF6;">
        ${jobs.length} New Match${jobs.length > 1 ? 'es' : ''} Found
      </h1>
      <p style="color:#6A8BA8;margin:0 0 32px;font-size:14px;">
        These roles passed your standards filter. Review and apply if they fit.
      </p>
      ${listItems}
      <hr style="border:none;border-top:1px solid #142840;margin:32px 0;" />
      <p style="font-family:monospace;font-size:10px;color:#3A5A78;">
        Sent by your Portfolio Proof notification system.<br />
        Adjust filters in lib/notifications.js
      </p>
    </body>
    </html>
  `
}
