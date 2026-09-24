'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  generateRandomName,
  generateRandomTitle,
  generateRandomTheme,
} from '@/utils/nameGenerator';
import type { AIProviderType } from '@/utils/aiProvider';

interface ProviderStatus {
  provider: AIProviderType;
  model: string;
  baseUrl: string;
  hasApiKey: boolean;
  lockedByEnv: boolean;
  gateEnabled: boolean;
}

export default function SettingsPage() {
  const [status, setStatus] = useState<ProviderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [generatedName, setGeneratedName] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedTheme, setGeneratedTheme] = useState('');
  const router = useRouter();

  const loadStatus = async () => {
    const response = await fetch('/api/ai/status');
    if (!response.ok) {
      throw new Error('Could not load AI provider status.');
    }
    setStatus((await response.json()) as ProviderStatus);
  };

  useEffect(() => {
    loadStatus().catch((err) => {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    });
  }, []);

  const handleTest = async () => {
    try {
      setIsTesting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        provider?: string;
        model?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || 'Provider is unreachable.');
      }

      setSuccess(
        `Connected to ${data.provider} using ${data.model}. API keys stayed on the server.`
      );
      await loadStatus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to test the AI provider'
      );
    } finally {
      setIsTesting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">AI Provider</h2>
          <p className="text-sm text-slate-600 mb-4">
            Ollama is the default local brain. xAI Grok is the hosted backup.
            Keys such as XAI_API_KEY stay on the server and are never stored in
            the browser.
          </p>

          {status ? (
            <dl className="mb-4 space-y-2 text-sm">
              <div>
                <dt className="font-medium text-slate-700">Active provider</dt>
                <dd className="text-slate-900">{status.provider}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Model</dt>
                <dd className="text-slate-900">{status.model}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Base URL</dt>
                <dd className="text-slate-900 break-all">{status.baseUrl}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Server API key</dt>
                <dd className="text-slate-900">
                  {status.provider === 'ollama'
                    ? 'Not needed for Ollama'
                    : status.hasApiKey
                      ? 'Configured on the server'
                      : 'Missing on the server'}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-700">Chosen by</dt>
                <dd className="text-slate-900">
                  {status.lockedByEnv
                    ? 'AI_PROVIDER environment variable'
                    : 'Local default (Ollama) or Settings UI'}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-slate-500 mb-4">Loading provider…</p>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
              {success}
            </div>
          )}

          <button
            onClick={handleTest}
            disabled={isTesting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isTesting ? 'Testing…' : 'Test AI connection'}
          </button>

          {status?.gateEnabled && (
            <button
              onClick={handleLogout}
              className="w-full mt-3 border border-slate-300 text-slate-700 py-2 px-4 rounded-md hover:bg-slate-50"
            >
              Lock this device
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Name Generator</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedName}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  placeholder="Click generate to create a name"
                />
                <button
                  onClick={() => setGeneratedName(generateRandomName())}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Title
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedTitle}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  placeholder="Click generate to create a title"
                />
                <button
                  onClick={() => setGeneratedTitle(generateRandomTitle())}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Theme
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedTheme}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  placeholder="Click generate to create a theme"
                />
                <button
                  onClick={() => setGeneratedTheme(generateRandomTheme())}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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
