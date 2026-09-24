# Book Writer Pro

Private book-writing app for **Aaron Vanderpool**. Published by **A.C.C. L.L.C.**

The real app is the Next.js project at the repo root. Run it with `npm run dev` on port **3003**.

Ollama on `127.0.0.1:11434` with `gemma4:latest` is the default AI. xAI Grok is the hosted backup. API keys stay on the server.

## Quick start

```bash
copy .env.example .env.local   # Windows
# or: cp .env.example .env.local
npm install
npm run dev
```

Open [http://127.0.0.1:3003](http://127.0.0.1:3003).

The included `.npmrc` sets `legacy-peer-deps=true` because some editor packages disagree about versions.

On the writing PC, leave `APP_PASSWORD` empty. On Vercel, set `APP_PASSWORD` so only you can open the hosted copy.

Full setup (Ollama, Tailscale Serve, Vercel + Grok) is in [`docs/SETUP.md`](docs/SETUP.md).

## What this app does

- Write and organize chapters in the browser
- Auto-save the manuscript to this device (refresh does not wipe your draft)
- Generate, rewrite, outline, and continuity-check through one server-side AI provider
- Export Markdown or JSON when you want a file copy
- Optional voice dictation in Chromium browsers

Book files in `Book/` (including Lumina-Umbra) stay in the repo. The app does not delete or rewrite them.

## Useful commands

```bash
npm run dev          # http://127.0.0.1:3003
npm test
npx tsc --noEmit
npx next lint
npx next build
npm run start
```

## Environment

See `.env.example`. The important ones:

| Variable | Default / purpose |
| --- | --- |
| `AI_PROVIDER` | `ollama` |
| `OLLAMA_BASE_URL` | `http://127.0.0.1:11434` |
| `OLLAMA_MODEL` | `gemma4:latest` |
| `XAI_API_KEY` | server-only Grok key |
| `APP_PASSWORD` | login gate on hosted deploys |

Do not commit `.env.local` or put keys in `NEXT_PUBLIC_` variables.

## Author

Aaron Vanderpool  
Publisher: A.C.C. L.L.C.
