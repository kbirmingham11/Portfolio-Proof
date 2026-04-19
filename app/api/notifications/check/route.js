import { MY_STANDARDS, LINKEDIN_RSS_FEEDS, scoreJob, formatNotificationEmail } from '@/lib/notifications'

const seenJobIds = new Set()

export async function GET(request) {
  const secret = request.headers.get('x-cron-secret')
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const allJobs = await fetchLinkedInJobs()
    const newJobs = allJobs.filter(job => !seenJobIds.has(job.id))

    const scored = newJobs.map(job => ({
      job,
      ...scoreJob(job),
    }))

    const matches = scored.filter(({ pass }) => pass)

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

async function fetchLinkedInJobs() {
  return []
}

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
