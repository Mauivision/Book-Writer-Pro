# How Aaron runs Book Writer

The real app is the Next.js project at the repo root (`npm run dev`). The `WebApp` folder and the Python files (`src_python`, `ollama_book_generator.py`) are older extras. You do not need them for daily writing.

There are two setups. Use the Windows PC as the main one. Use Vercel only when the PC is off.

API keys stay on the server. The browser never receives `XAI_API_KEY` or `APP_PASSWORD`.

## A. Main: Windows PC + Ollama (free, private)

This is the everyday setup. The writing app and the AI both run on your PC. Phones and other computers reach the app through Tailscale.

### 1. Install the tools

1. Install [Node.js LTS](https://nodejs.org/).
2. Install [Ollama](https://ollama.com/) and keep the Ollama app running, or run `ollama serve` in a terminal.
3. In a terminal:

```bat
ollama pull llama3.1
```

Use another model name if you prefer. Then set `OLLAMA_MODEL` to that name.

4. Clone this repo (or open the folder you already have).

### 2. Start the writing app

In the project folder:

```bat
copy .env.example .env.local
npm install
npm run dev
```

`npm install` needs the included `.npmrc` (`legacy-peer-deps=true`) because some editor packages disagree about versions.

On this PC, leave `APP_PASSWORD` empty so you are not asked to log in.

Open the app at [http://localhost:3003](http://localhost:3003).

To run the built app instead of the developer server:

```bat
npm run build
npm run start
```

### 3. Reach it from your other devices (Tailscale)

1. Install Tailscale on the Windows PC and on the phone/laptop you want to write from. Sign both into the same Tailscale account.
2. On the PC, copy the Tailscale IP (it looks like `100.x.x.x`).
3. On the other device, open `http://100.x.x.x:3003`.

The other device talks only to the writing app. The app talks to Ollama on `localhost`, so you do not expose Ollama itself.

If the page does not load from another device:

- Confirm `npm run dev` or `npm run start` is still running.
- In Windows Firewall, allow Node.js on port `3003` for private/Tailscale networks.
- Use the Tailscale IP, not `localhost`, on the other device.

### Useful env vars on the PC

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
```

If Ollama is not running, the app shows a clear error instead of a generic failure.

## B. Backup: Vercel + xAI Grok (always online)

Use this when the PC is off. The hosted site is locked with a password so only you can open your manuscripts.

### 1. Create the xAI key

1. Get an API key from the [xAI console](https://console.x.ai).
2. xAI’s API is OpenAI-compatible at `https://api.x.ai/v1`.
3. Current chat model from [xAI’s model docs](https://docs.x.ai/developers/models): `grok-4.7`. You can change this later with `XAI_MODEL`.

### 2. Deploy

Import this GitHub repo into Vercel. Add these environment variables in the Vercel project settings (Production and Preview):

| Name | Example | Required |
| --- | --- | --- |
| `AI_PROVIDER` | `xai` | Yes |
| `XAI_API_KEY` | your xAI key | Yes |
| `XAI_MODEL` | `grok-4.7` | Recommended |
| `XAI_BASE_URL` | `https://api.x.ai/v1` | Optional |
| `APP_PASSWORD` | a long password only you know | Yes |

Do not put the xAI key or the site password in the browser, in git, or in `NEXT_PUBLIC_` variables.

If you set `XAI_API_KEY` on Vercel and forget `AI_PROVIDER`, the app still picks xAI on Vercel.

### 3. After it deploys

1. Open the Vercel URL.
2. Sign in with `APP_PASSWORD`.
3. On Settings, use **Test AI connection** if you want to confirm Grok is reachable.

Sign out from Settings when you are done on a shared browser.

## Switching brains

| Goal | Set this |
| --- | --- |
| Local Ollama | `AI_PROVIDER=ollama` |
| Hosted Grok | `AI_PROVIDER=xai` plus `XAI_API_KEY` |
| Optional OpenAI | `AI_PROVIDER=openai` plus `OPENAI_API_KEY` |

The Settings page and the in-app AI settings panel can remember a local Ollama URL/model. They cannot store API keys.

## Security notes

- On the PC, skip `APP_PASSWORD` so Tailscale devices can open the app.
- On Vercel, always set `APP_PASSWORD`. Every page and API route is blocked until you sign in.
- Book files in the `Book` folder (including Lumina-Umbra) stay in the repo. This setup does not delete or rewrite them.
