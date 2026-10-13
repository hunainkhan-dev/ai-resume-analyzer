import { useState } from 'react';

const EXAMPLE_RESUME = `Hunain Khan — Full-Stack Developer
Built and deployed a MERN e-commerce platform (React, Node, Express, MongoDB) with JWT auth and an admin dashboard.
Shipped 8+ animated React + Tailwind sites; strong with Vite, GSAP, Framer Motion.
Built an AI chatbot on Vercel serverless functions using an LLM API.
Comfortable with REST APIs, Git/GitHub, responsive design.`;

const EXAMPLE_JOB = `We're hiring a Frontend Engineer.
Required: React, TypeScript, Tailwind CSS, REST API integration, Git.
Nice to have: Next.js, testing (Jest/RTL), CI/CD, accessibility (a11y).
You will build and ship customer-facing UI, work with designers, and write clean, tested components.`;

export default function App() {
  const [resume, setResume] = useState('');
  const [job, setJob] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function analyze() {
    if (loading) return;
    setError('');
    setResult(null);
    if (resume.trim().length < 40 || job.trim().length < 40) {
      setError('Paste both a resume and a job description (a bit more text needed).');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, job }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  function loadExample() {
    setResume(EXAMPLE_RESUME);
    setJob(EXAMPLE_JOB);
    setError('');
    setResult(null);
  }

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-5xl px-5 pt-14 text-center">
        <p className="animate-fadeup text-sm uppercase tracking-[0.3em] text-brand-light">AI Career Tool</p>
        <h1 className="mt-4 animate-fadeup font-display text-5xl font-bold leading-tight sm:text-6xl">
          MatchPoint
        </h1>
        <p className="mx-auto mt-4 max-w-xl animate-fadeup text-lg text-muted">
          Paste your résumé and a job post. AI scores your fit, finds the keywords you're missing, and rewrites your bullets to beat the ATS.
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">
        {/* Inputs */}
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Your résumé" value={resume} onChange={setResume} placeholder="Paste your résumé text here…" />
          <Field label="Job description" value={job} onChange={setJob} placeholder="Paste the job post here…" />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={analyze}
            disabled={loading}
            className="rounded-full bg-brand px-8 py-3.5 font-semibold text-white transition hover:bg-brand-light disabled:opacity-50"
          >
            {loading ? 'Analyzing…' : 'Analyze match →'}
          </button>
          <button onClick={loadExample} className="rounded-full border border-line px-6 py-3.5 font-medium text-muted transition hover:border-brand hover:text-ink">
            Try an example
          </button>
        </div>

        {error && <p className="mt-5 text-center text-warn">{error}</p>}

        {/* Results */}
        {result && (
          <section className="mt-12 animate-fadeup space-y-6">
            <div className="flex flex-col items-center gap-5 rounded-3xl border border-line bg-panel/60 p-8 sm:flex-row sm:items-center sm:gap-8">
              <ScoreRing score={result.score} />
              <div>
                <p className="font-display text-2xl font-semibold">{result.verdict}</p>
                <p className="mt-2 text-muted">{result.summary}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Panel title="✅ Matched keywords" chips={result.matched} tone="good" empty="None detected." />
              <Panel title="⚠️ Missing — add these" chips={result.missing} tone="warn" empty="Nothing major missing!" />
            </div>

            {result.suggestions?.length > 0 && (
              <div className="rounded-3xl border border-line bg-panel/60 p-7">
                <h3 className="font-display text-xl font-semibold">✍️ How to improve your résumé</h3>
                <ul className="mt-4 space-y-3">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink/90">
                      <span className="mt-0.5 text-brand-light">→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="border-t border-line px-5 py-8 text-center text-sm text-muted">
        Built by <a href="https://axiomwebbuilder.com" className="text-ink underline decoration-brand/50">Axiom Web Builder</a> · Karachi 💙 ·{' '}
        <span className="text-muted/70">Your text is sent to the AI only to analyze — nothing is stored.</span>
      </footer>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-muted">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={10}
        className="scroll-slim w-full resize-y rounded-2xl border border-line bg-panel/50 p-4 text-sm leading-relaxed text-ink outline-none transition placeholder:text-muted/60 focus:border-brand"
      />
    </label>
  );
}

function Panel({ title, chips, tone, empty }) {
  const toneCls = tone === 'good' ? 'border-good/30 bg-good/10 text-good' : 'border-warn/30 bg-warn/10 text-warn';
  return (
    <div className="rounded-3xl border border-line bg-panel/60 p-7">
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      {chips?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((c, i) => (
            <span key={i} className={`rounded-full border px-3 py-1 text-sm ${toneCls}`}>{c}</span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">{empty}</p>
      )}
    </div>
  );
}

function ScoreRing({ score }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  const color = score >= 75 ? '#34D399' : score >= 50 ? '#FBBF24' : '#F87171';
  return (
    <div className="relative grid h-32 w-32 shrink-0 place-items-center">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#24314F" strokeWidth="9" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute text-center">
        <span className="font-display text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="block text-xs text-muted">/ 100</span>
      </div>
    </div>
  );
}
