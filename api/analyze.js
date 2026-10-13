// Vercel serverless function: POST /api/analyze
// Body: { resume: string, job: string }
// Returns: { score, verdict, matched[], missing[], suggestions[], summary } or { error }
//
// GROQ_API_KEY lives only in the server env — never shipped to the browser.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';

const SYSTEM_PROMPT = `You are an expert technical recruiter and ATS (applicant tracking system) engine.
Given a RESUME and a JOB DESCRIPTION, assess how well the candidate matches the role.

Return ONLY a single valid JSON object (no markdown, no backticks, no prose) with EXACTLY these keys:
{
  "score": <integer 0-100, overall match>,
  "verdict": "<<=12 words, blunt summary of fit>",
  "matched": ["<skills/keywords present in BOTH resume and job>", ...],
  "missing": ["<important keywords/requirements in the job that are MISSING from the resume>", ...],
  "suggestions": ["<3-6 concrete, specific improvements: rewritten resume bullet points or actions to raise the match>", ...],
  "summary": "<2-3 sentence honest assessment of the candidate for this role>"
}
Base everything strictly on the two texts. Keep arrays concise (max ~8 items). Output JSON only.`;

function extractJSON(text) {
  if (!text) return null;
  let t = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  const a = t.indexOf('{');
  const b = t.lastIndexOf('}');
  if (a === -1 || b === -1) return null;
  try {
    return JSON.parse(t.slice(a, b + 1));
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    res.status(200).json({ error: 'The AI key is not set yet. Add GROQ_API_KEY in Vercel.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const resume = String(body.resume || '').slice(0, 8000);
    const job = String(body.job || '').slice(0, 6000);
    if (resume.length < 40 || job.length < 40) {
      res.status(200).json({ error: 'Please paste both a resume and a job description (a bit more text needed).' });
      return;
    }

    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: 1600,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `RESUME:\n${resume}\n\n---\n\nJOB DESCRIPTION:\n${job}` },
        ],
      }),
    });

    if (!groqRes.ok) {
      const detail = await groqRes.text();
      console.error('Groq error', groqRes.status, detail.slice(0, 300));
      res.status(200).json({ error: 'The AI is busy right now — please try again in a moment.' });
      return;
    }

    const data = await groqRes.json();
    const raw = data?.choices?.[0]?.message?.content || '';
    const parsed = extractJSON(raw);
    if (!parsed || typeof parsed.score === 'undefined') {
      res.status(200).json({ error: 'Could not parse the analysis — please try again.' });
      return;
    }

    res.status(200).json({
      score: Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0))),
      verdict: String(parsed.verdict || ''),
      matched: Array.isArray(parsed.matched) ? parsed.matched.slice(0, 12) : [],
      missing: Array.isArray(parsed.missing) ? parsed.missing.slice(0, 12) : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 8) : [],
      summary: String(parsed.summary || ''),
    });
  } catch (err) {
    console.error('analyze handler error', err?.message);
    res.status(200).json({ error: 'Something went wrong — please try again.' });
  }
}
