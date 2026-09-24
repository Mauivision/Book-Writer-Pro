# How to run Book-Writer-Pro

This is Aaron’s personal Next.js writing app (`src/`). The older `WebApp/` folder and the Python helpers (`src_python/`, `ollama_book_generator.py`) are leftovers. You do not need them for day-to-day writing.

There are two ways to run it. Both keep API keys on the server. The browser never sees `XAI_API_KEY`.

## A. Main: your Windows PC + Ollama (free, private)

Other phones and laptops reach this copy over Tailscale. Ollama stays on the PC. The website on the PC talks to Ollama at `localhost`.

### 1. Install once

1. Install [Node.js 18+](https://nodejs.org/) and [Ollama for Windows](https://ollama.com/download).
2. Open PowerShell in the project folder and install app packages:

```powershell
npm install
copy .env.example .env.local
```

3. Pull a local model (first time only):

```powershell
ollama pull llama3.1
```

4. Leave `.env.local` on the Ollama defaults (or omit `AI_PROVIDER` — Ollama is the default):

```
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
```

Leave `APP_PASSWORD` blank so the lock is off at home.

### 2. Start it

Two terminals are enough:

```powershell
ollama serve
```

```powershell
npm run dev
```

Then open http://localhost:3003 on the PC.

For a more “always on” copy after you trust the build:

```powershell
npm run build
npm start
```

`npm start` uses port 3000 unless you change it. `npm run dev` uses port 3003.

### 3. Reach it from your other devices over Tailscale

1. Install Tailscale on the Windows PC and on the phone/laptop. Sign into the same tailnet.
2. On the PC, copy its Tailscale IP (it looks like `100.x.x.x`) from the Tailscale app.
3. Keep Ollama and the Next.js app running on the PC.
4. On the other device, open `http://100.x.x.x:3003` (use the port you actually started).
5. If the page does not load, allow Node.js on that port in Windows Firewall for private/Tailscale networks.

You do **not** need to expose Ollama to the tailnet. Only the website must be reachable. The website then talks to Ollama on `localhost`.

If a generation fails, the app should say that Ollama is unreachable. Start `ollama serve` and confirm `ollama list` shows your model.

## B. Backup: Vercel + xAI Grok (always online)

Use this when the PC is off. This copy must stay private.

### 1. xAI setup

1. Create an API key at [https://console.x.ai/](https://console.x.ai/).
2. Current chat models are listed at [https://docs.x.ai/developers/models](https://docs.x.ai/developers/models). As of this writing the recommended text model is `grok-4.7`. Aliases such as `grok-latest` also exist. The API is OpenAI-compatible at `https://api.x.ai/v1`.

### 2. Vercel env vars

In the Vercel project, set:

| Name | Example | Notes |
| --- | --- | --- |
| `AI_PROVIDER` | `xai` | Turns on Grok as the brain |
| `XAI_API_KEY` | `xai-...` | Server only. Never `NEXT_PUBLIC_` |
| `XAI_BASE_URL` | `https://api.x.ai/v1` | Optional; this is the default |
| `XAI_MODEL` | `grok-4.7` | Optional; this is the default |
| `APP_PASSWORD` | a long password only you know | Locks every page and API route |

Do not set `APP_PASSWORD` on the Windows PC unless you also want the lock there.

### 3. Deploy

Import the GitHub repo into Vercel, add the env vars, and deploy. After it is live, open the Vercel URL. You should get a password page. Wrong password stays out. After you sign in, Settings → Test AI connection should report `xai` / `grok-4.7`.

If Grok is down or the key is missing, the app returns a plain-English error instead of a blank failure.

## Switching brains

- **Env wins.** If `AI_PROVIDER` is set (`ollama` or `xai`), that instance stays on that provider.
- **Local default.** If `AI_PROVIDER` is unset, the app uses Ollama.
- **Keys stay on the server.** Changing providers in the UI never stores `XAI_API_KEY` in the browser.

## Quick “is it working?” checks

```powershell
npm run type-check
npm run lint
npm test
npm run build
```
