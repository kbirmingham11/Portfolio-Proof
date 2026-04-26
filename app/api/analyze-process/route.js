export async function POST(request) {
  try {
    const { process } = await request.json()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Analyze this business process for inefficiencies and improvement opportunities. Return ONLY valid JSON with no markdown, no backticks, no explanation — just the raw JSON object.

Process description:
${process}

Return this exact JSON structure:
{
  "inefficiencies": ["string", "string", "string"],
  "improvements": [
    {"suggestion": "string", "impact": "string"},
    {"suggestion": "string", "impact": "string"},
    {"suggestion": "string", "impact": "string"}
  ],
  "risks": ["string", "string", "string"]
}

Keep each item concise (1-2 sentences max). Impact should be a brief metric estimate like "Est. -30% processing time".`,
        }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || '{}'
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
    return Response.json(parsed)

  } catch (error) {
    return Response.json({ error: 'Analysis failed. Make sure ANTHROPIC_API_KEY is set in your environment variables.' }, { status: 500 })
  }
}
