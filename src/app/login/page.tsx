'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => {
    const next = searchParams?.get('next');
    if (!next || !next.startsWith('/') || next.startsWith('//')) {
      return '/';
    }
    return next;
  }, [searchParams]);

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        next?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || 'Wrong password.');
      }

      router.replace(data.next || nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Private book studio
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            This hosted copy is for Aaron only. Enter the password from
            APP_PASSWORD to continue.
          </p>
        </div>

        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="App password"
            required
          />
        </label>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !password}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Checking…' : 'Open the studio'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-600">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
