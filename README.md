# 🎯 MatchPoint — AI Resume & Job-Match Analyzer

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38BDF8?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Serverless-Vercel-000000?logo=vercel&logoColor=white)
![Groq](https://img.shields.io/badge/LLM-Groq-F55036)

Paste your **résumé** and a **job description** — MatchPoint's AI scores how well you fit (0–100), shows the keywords you already match, flags the ones you're **missing**, and rewrites your bullet points to beat the ATS.

### 🔗 [**View Live Demo →**](https://ai-resume-analyzer-ax.vercel.app)

> Click **"Try an example"** on the live site to see a full analysis instantly.

---

## ✨ Features

- **Match score** with an animated ring (green / amber / red)
- **Matched vs missing keywords** as colour-coded chips
- **Actionable rewrites** — concrete improved résumé bullets, not vague advice
- **Honest verdict + summary** of your fit for the role
- One-click example, mobile-first, no sign-up
- **Privacy:** text is sent to the LLM only to analyze — nothing is stored

---

## 🧱 Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| AI backend | Vercel serverless function (`/api/analyze`) |
| LLM | Groq (Qwen 3) — returns structured JSON |
| Hosting | Vercel (free, no card) |

---

## 🧠 How it works

```
Résumé + Job text → POST /api/analyze (Vercel serverless)
  → recruiter/ATS system prompt → Groq LLM → strict JSON
  → rendered as score, keyword chips, and rewrite suggestions
```

The server prompts the model as an expert recruiter + ATS and forces a strict
JSON response, which is parsed defensively and rendered.

---

## 🚀 Run locally

```bash
npm install
cp .env.example .env         # add your free Groq key (console.groq.com/keys)
npm run dev                  # Vite UI on :5173
vercel dev                   # serves /api on :3000 (separate terminal)
```

Deploy: push to GitHub, import on Vercel, add `GROQ_API_KEY`.

---

Built by **[Axiom Web Builder](https://axiomwebbuilder.com)** · Karachi 💙
