'use client';

import { FormEvent, Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [gateEnabled, setGateEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/session', { credentials: 'same-origin' })
      .then((response) => response.json())
      .then((data: { gateEnabled?: boolean; authenticated?: boolean }) => {
        if (cancelled) return;
        setGateEnabled(Boolean(data.gateEnabled));
        if (!data.gateEnabled || data.authenticated) {
          router.replace('/');
        }
      })
      .catch(() => {
        if (!cancelled) setGateEnabled(true);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) {
        setError(data.error || 'Could not sign in.');
        return;
      }
      const nextPath = searchParams?.get('next') || '/';
      router.replace(nextPath.startsWith('/') ? nextPath : '/');
      router.refresh();
    } catch {
      setError('Could not reach the login page. Try again.');
    } finally {
      setBusy(false);
    }
  };

  if (gateEnabled === null) {
    return <p className="text-center text-slate-600">Checking access…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
          Site password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          required
        />
      </div>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <button
        type="submit"
        disabled={busy || !password.trim()}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Book Writer</h1>
        <p className="mt-2 mb-6 text-sm text-slate-600">
          This hosted copy is private. Enter the password from your Vercel
          <code className="mx-1 rounded bg-slate-100 px-1">APP_PASSWORD</code>
          env var.
        </p>
        <Suspense fallback={<p className="text-slate-600">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
