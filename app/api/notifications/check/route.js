/**
 * app/api/notifications/check/route.js
 *
 * Vercel Cron endpoint — called every 4 hours automatically.
 * Add this to vercel.json crons section (see below).
 *
 * vercel.json addition:
 * {
 *   "crons": [
 *     {
 *       "path": "/api/notifications/check",
 *       *       "schedule": "0 */4 * * *"
 *     }
 *   ]
 * }
 *
 * Environment variables needed in Vercel:
 *   RESEND_API_KEY      — from resend.com (free tier: 3000 emails/mo)
 *   NOTIFICATION_EMAIL  — where to send alerts (your email)
 *   CRON_SECRET         — any random string, add to vercel.json cron header
 */

import { MY_STANDARDS, LINKEDIN_RSS_FEEDS, scoreJob, formatNotificationEmail } from '@/lib/notifications'

// Simple in-memory seen set (for production, use Vercel KV or Upstash Redis)
const seenJobIds = new Set()

export async function GET(request) {
  // Verify cron secret
  const secret = request.headers.get('x-cron-secret')
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const allJobs = await fetchLinkedInJobs()
    const newJobs = allJobs.filter(job => !seenJobIds.has(job.id))

    // Score each new job
    const scored = newJobs.map(job => ({
      job,
      ...scoreJob(job),
    }))

    const matches = scored.filter(({ pass }) => pass)

    // Mark all as seen
    newJobs.forEach(job => seenJobIds.add(job.id))

    if (matches.length > 0) {
      await sendNotificationEmail(matches)
    }

    return Response.json({
      checked: allJobs.length,
      newJobs: newJobs.length,
      matches: matches.length,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Notification check failed:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// ─── Fetch LinkedIn jobs via unofficial RSS ───────────────────────────────────
async function fetchLinkedInJobs() {
  const jobs = []

  for (const feedUrl of LINKEDIN_RSS_FEEDS) {
    try {
      // LinkedIn jobs are accessible via their search page
      // For production: use a service like Proxycurl, RapidAPI LinkedIn,
      // or the official LinkedIn Job Search API (requires partner access)
      //
      // Free alternative: use SerpAPI or Apify to scrape LinkedIn job listings
      // and return them in this format:
      const mockJobs = [
        // This is where scraped/API results would populate
        // Each job should have: id, title, company, location, description, url, salary
      ]
      jobs.push(...mockJobs)
    } catch (err) {
      console.error(`Failed to fetch feed: ${feedUrl}`, err)
    }
  }

  return jobs
}

// ─── Send email via Resend ────────────────────────────────────────────────────
async function sendNotificationEmail(matches) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const html = formatNotificationEmail(matches)

  await resend.emails.send({
    from: 'alerts@kameronbirmingham.dev',
    to: process.env.NOTIFICATION_EMAIL,
    subject: `[Portfolio Proof] ${matches.length} new opportunity match${matches.length > 1 ? 'es' : ''}`,
    html,
  })
}

/**
 * ─── PRODUCTION OPTIONS FOR JOB DATA ────────────────────────────────────────
 *
 * Option A — Free: Apify LinkedIn Scraper
 *   - Sign up at apify.com (free tier available)
 *   - Use the "LinkedIn Jobs Scraper" actor
 *   - Call via: https://api.apify.com/v2/acts/RUN_ID/runs
 *   - Returns structured job data
 *
 * Option B — Paid: Proxycurl API ($10/mo)
 *   - proxycurl.com — LinkedIn data API
 *   - Most reliable, structured output
 *
 * Option C — Free: LinkedIn RSS (limited)
 *   - LinkedIn RSS feeds are at:
 *     linkedin.com/jobs/search/?keywords=...&format=rss
 *   - Parse XML with fast-xml-parser npm package
 *   - Rate-limited but works for personal use
 *
 * Recommended for your use case: Option A (Apify free tier)
 * ────────────────────────────────────────────────────────────────────────────
 */
