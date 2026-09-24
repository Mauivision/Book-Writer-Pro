# How Aaron runs Book Writer

The real app is the Next.js project at the repo root (`npm run dev` on port 3003). There is no separate WebApp or Python Ollama helper. Daily writing uses this Next.js app only.

There are two setups. Use the Windows PC as the main one. Use Vercel only when the PC is off.

API keys stay on the server. The browser never receives `XAI_API_KEY` or `APP_PASSWORD`.

## This PC (already checked)

| Item | What is on the machine |
| --- | --- |
| OS | Windows 11 Home |
| GPU / RAM | RTX 5080 (16 GB VRAM), 31 GB RAM |
| Node / Git | Node v24.19.0, Git 2.53.0 |
| Ollama | 0.34.4, listening on `127.0.0.1:11434` only (`OLLAMA_HOST` is unset — keep it that way) |
| Models already pulled | `gemma4:latest` (default), `qwen3:8b`, `llama3.1:8b` |
| Tailscale | Not installed yet |

That GPU/RAM is a good fit for 8B–14B models. Stay in that range. Do not pull 30B+ models.

## A. Main: Windows PC + Ollama (free, private)

The writing app and Ollama both stay on this PC. Ollama stays bound to localhost so nothing on the network can talk to it. Other devices reach **only** the Next.js app through Tailscale Serve.

### 1. Confirm the tools

Node, Git, and Ollama are already installed. Keep the Ollama app running (or `ollama serve` in a terminal). Leave `OLLAMA_HOST` unset so Ollama remains on `127.0.0.1:11434`.

Default model (already on the machine):

```bat
ollama list
```

You should see `gemma4:latest`. That is what the app uses unless you change `OLLAMA_MODEL`.

Optional upgrades to pull and test (12B–14B, still fine on 16 GB VRAM). Pick one, not both at once:

```bat
ollama pull qwen3:14b
ollama pull gemma3:12b
```

Then set `OLLAMA_MODEL` to `qwen3:14b` or `gemma3:12b` in `.env.local` and restart the app. Skip anything 30B or larger.

Open the project folder in a terminal if you have not already.

### 2. Start the writing app

In the project folder:

```bat
copy .env.example .env.local
npm install
npm run dev
```

`npm install` needs the included `.npmrc` (`legacy-peer-deps=true`) because some editor packages disagree about versions.

On this PC, leave `APP_PASSWORD` empty so you are not asked to log in.

The app listens on this machine only: [http://127.0.0.1:3003](http://127.0.0.1:3003).

To run the built app instead of the developer server:

```bat
npm run build
npm run start
```

### 3. Reach it from your other devices (install Tailscale, then Serve)

Do not open Ollama to the LAN or Tailscale. Do not set `OLLAMA_HOST=0.0.0.0`. Other devices should never call port `11434`.

1. Install Tailscale on this Windows PC from [https://tailscale.com/download/windows](https://tailscale.com/download/windows).
2. Install Tailscale on the phone or laptop you want to write from.
3. Sign both devices into the same Tailscale account and turn Tailscale on.
4. On the PC, with the writing app already running on port `3003`, open a terminal and run:

```bat
tailscale serve 3003
```

That command proxies **only** `http://127.0.0.1:3003` (the Next.js app) onto your private Tailscale network. Ollama stays on localhost.

5. Copy the `https://….ts.net` URL that Tailscale prints. On the other device (also on Tailscale), open that URL.

To keep Serve running after you close the terminal:

```bat
tailscale serve --bg 3003
```

To stop sharing:

```bat
tailscale serve reset
```

Do not use `tailscale funnel`. Funnel would put the app on the public internet.

If the other device cannot load the page:

- Confirm `npm run dev` or `npm run start` is still running on the PC.
- Confirm Tailscale is connected on both devices.
- Confirm `tailscale serve 3003` is still running and you used the `https://….ts.net` URL, not `localhost`.

### Useful env vars on the PC

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=gemma4:latest
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

- On the PC, skip `APP_PASSWORD`. Only your Tailscale devices can open the Next.js URL, and Ollama is not on that network.
- On Vercel, always set `APP_PASSWORD`. Every page and API route is blocked until you sign in.
- Book files in the `Book` folder (including Lumina-Umbra) stay in the repo. This setup does not delete or rewrite them.
