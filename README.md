# AI Interview Preparation Platform — Frontend Demo

A polished frontend demo (mock data, no backend yet) for an AI-powered
interview prep platform: login/register, dashboard with charts, AI mock
interview flow, AI resume review with ATS score, coding problems list,
daily challenge, notes, and an interview roadmap.

## Tech

- React 18 + Vite
- recharts (charts)
- lucide-react (icons)
- Plain CSS-in-JS (inline styles) — no Tailwind/CSS framework dependency

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
interview-prep-platform/
├── index.html          # Vite entry HTML
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx         # React root
    └── App.jsx          # Entire app (all screens + mock data)
```

## Notes

- All data (problems, notes, feedback, scores, etc.) is mocked in `App.jsx`.
- The "voice answer" button in Mock Interview toggles a recording state only —
  wire it to the Web Speech API or a speech-to-text service to make it real.
- AI Resume Review and Mock Interview feedback are static mock responses —
  swap in calls to OpenAI/Gemini once you add a backend.
- Login/Register has no real authentication — it's a UI-only flow.

## Next steps (when moving past the demo)

1. Add a Spring Boot + MySQL backend with JWT authentication.
2. Replace mock AI feedback with real OpenAI/Gemini API calls.
3. Add speech-to-text for the voice interview mode.
4. Persist progress, notes, and bookmarks per user.
