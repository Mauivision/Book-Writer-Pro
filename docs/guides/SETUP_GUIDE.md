# Setup guide

Use the current instructions in [`docs/SETUP.md`](../SETUP.md).

The app is the Next.js project at the repo root:

```bash
npm install
npm run dev
```

It listens on [http://127.0.0.1:3003](http://127.0.0.1:3003).

Ollama (`gemma4:latest` on `127.0.0.1:11434`) is the default. xAI Grok is the Vercel backup. Copy `.env.example` to `.env.local` and never commit secrets.
