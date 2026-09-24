'use client';

import { useEffect, useState } from 'react';

interface ProviderStatus {
  provider?: string;
  model?: string;
  error?: string;
}

function displayName(provider?: string): string {
  if (provider === 'xai') return 'xAI Grok';
  if (provider === 'ollama') return 'Ollama';
  if (provider === 'openai') return 'OpenAI';
  if (provider === 'custom') return 'Custom AI';
  return provider || 'AI';
}

export default function ProviderStatusBadge() {
  const [status, setStatus] = useState<ProviderStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch('/api/ai/status', { credentials: 'same-origin' });
        const data = (await response.json()) as ProviderStatus;
        if (!cancelled) {
          setStatus(data);
        }
      } catch {
        if (!cancelled) {
          setStatus({ error: 'Could not read AI status' });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    const interval = window.setInterval(() => {
      void load();
    }, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <span className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-500">
        Checking AI…
      </span>
    );
  }

  if (status?.error && !status.model) {
    return (
      <span
        className="px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-xs text-amber-800"
        title={status.error}
      >
        AI unavailable
      </span>
    );
  }

  return (
    <span
      className="px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-xs text-emerald-800"
      title={status?.error || `${displayName(status?.provider)} · ${status?.model || 'unknown model'}`}
    >
      {displayName(status?.provider)} · {status?.model || 'unknown model'}
    </span>
  );
}
