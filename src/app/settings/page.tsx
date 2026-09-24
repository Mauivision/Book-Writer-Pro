'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateRandomName, generateRandomTitle, generateRandomTheme } from '@/utils/nameGenerator';
import type { AIProviderType } from '@/utils/aiProvider';

interface ProviderStatus {
  provider?: AIProviderType;
  model?: string;
  baseUrl?: string;
  hasApiKey?: boolean;
  gateEnabled?: boolean;
  error?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<ProviderStatus | null>(null);
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [gateEnabled, setGateEnabled] = useState(false);
  const [generatedName, setGeneratedName] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedTheme, setGeneratedTheme] = useState('');

  useEffect(() => {
    fetch('/api/ai/status', { credentials: 'same-origin' })
      .then((response) => response.json())
      .then((data: ProviderStatus) => {
        setStatus(data);
        setGateEnabled(Boolean(data.gateEnabled));
      })
      .catch(() => {
        setStatus({ error: 'Could not load provider status.' });
      });
  }, []);

  const handleTest = async () => {
    setIsTesting(true);
    setTestMessage(null);
    setTestError(null);
    try {
      const response = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({}),
      });
      const data = (await response.json()) as { error?: string; provider?: string; model?: string };
      if (!response.ok) {
        throw new Error(data.error || 'Connection failed');
      }
      setTestMessage(`Reached ${data.provider} using ${data.model}.`);
    } catch (error) {
      setTestError(error instanceof Error ? error.message : 'Connection failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">AI brain</h2>
          <p className="text-sm text-slate-600 mb-4">
            The writing brain is chosen on the server from env vars. API keys never go to the browser.
          </p>
          {status?.error && !status.provider && (
            <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{status.error}</p>
          )}
          {status?.provider && (
            <dl className="mb-4 space-y-2 text-sm">
              <div>
                <dt className="font-medium text-slate-700">Provider</dt>
                <dd className="text-slate-900">{status.provider}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Model</dt>
                <dd className="text-slate-900">{status.model}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Base URL</dt>
                <dd className="break-all text-slate-900">{status.baseUrl}</dd>
              </div>
            </dl>
          )}
          {status?.error && status.provider && (
            <p className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">{status.error}</p>
          )}
          {testError && (
            <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{testError}</p>
          )}
          {testMessage && (
            <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{testMessage}</p>
          )}
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isTesting ? 'Testing…' : 'Test AI connection'}
          </button>
          {gateEnabled && (
            <button
              onClick={handleLogout}
              className="mt-3 w-full rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              Sign out
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Name Generator</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Story Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedName}
                  readOnly
                  className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                  placeholder="Click generate to create a name"
                />
                <button
                  onClick={() => setGeneratedName(generateRandomName())}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Generate
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Story Title</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedTitle}
                  readOnly
                  className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                  placeholder="Click generate to create a title"
                />
                <button
                  onClick={() => setGeneratedTitle(generateRandomTitle())}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Generate
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Story Theme</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedTheme}
                  readOnly
                  className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                  placeholder="Click generate to create a theme"
                />
                <button
                  onClick={() => setGeneratedTheme(generateRandomTheme())}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
