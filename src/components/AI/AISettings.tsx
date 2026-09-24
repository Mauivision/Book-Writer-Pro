'use client';

import React, { useState, useEffect } from 'react';
import {
  AIProviderConfig,
  AIProviderType,
  loadProviderConfig,
  saveProviderConfig,
  getDefaultConfig,
} from '@/utils/aiProvider';
import { sanitizeClientProviderConfig } from '@/utils/aiProvider';

interface AISettingsProps {
  onClose: () => void;
}

const AISettings: React.FC<AISettingsProps> = ({ onClose }) => {
  const [config, setConfig] = useState<AIProviderConfig>(
    getDefaultConfig('ollama')
  );
  const [lockedByEnv, setLockedByEnv] = useState(false);
  const [testStatus, setTestStatus] = useState<
    'idle' | 'testing' | 'success' | 'error'
  >('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    setConfig(loadProviderConfig());
    fetch('/api/ai/status')
      .then((response) => (response.ok ? response.json() : null))
      .then(
        (
          data: {
            lockedByEnv?: boolean;
            provider?: AIProviderType;
            baseUrl?: string;
            model?: string;
          } | null
        ) => {
          if (!data?.lockedByEnv || !data.provider) {
            return;
          }
          setLockedByEnv(true);
          setConfig({
            type: data.provider,
            baseUrl: data.baseUrl || getDefaultConfig(data.provider).baseUrl,
            model: data.model || getDefaultConfig(data.provider).model,
          });
        }
      )
      .catch(() => {
        // Settings still work from local defaults.
      });
  }, []);

  const handleTypeChange = (type: AIProviderType) => {
    if (lockedByEnv) return;
    const defaults = getDefaultConfig(type);
    setConfig(defaults);
    setTestStatus('idle');
  };

  const handleSave = () => {
    saveProviderConfig(config);
    onClose();
  };

  const handleTest = async () => {
    setTestStatus('testing');
    try {
      const response = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerConfig: sanitizeClientProviderConfig(config),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        provider?: string;
        model?: string;
      };
      if (!response.ok) {
        throw new Error(data.error || 'Connection failed.');
      }
      setTestStatus('success');
      setTestMessage(
        `Connected to ${data.provider} (${data.model}). Server-side keys were used; nothing was stored in the browser.`
      );
    } catch (err) {
      setTestStatus('error');
      setTestMessage(
        err instanceof Error ? err.message : 'Connection failed.'
      );
    }
  };

  const providers: { type: AIProviderType; label: string; desc: string }[] = [
    { type: 'ollama', label: 'Ollama (Local)', desc: 'Free. Runs on this PC.' },
    {
      type: 'xai',
      label: 'xAI Grok',
      desc: 'Hosted backup. Uses XAI_API_KEY on the server.',
    },
    {
      type: 'openai',
      label: 'OpenAI',
      desc: 'Uses OPENAI_API_KEY on the server.',
    },
    {
      type: 'custom',
      label: 'Custom API',
      desc: 'Any OpenAI-compatible endpoint.',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            AI Provider Settings
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-5">
          {lockedByEnv && (
            <p className="text-sm text-amber-800 bg-amber-50 rounded-lg p-3">
              AI_PROVIDER is set on the server, so this instance stays on that
              provider. Change the env var to switch.
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {providers.map((provider) => (
              <button
                key={provider.type}
                onClick={() => handleTypeChange(provider.type)}
                disabled={lockedByEnv}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  config.type === provider.type
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                } disabled:opacity-70`}
              >
                <div className="font-medium text-sm text-slate-800">
                  {provider.label}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {provider.desc}
                </div>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Base URL
            </label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(event) =>
                setConfig({ ...config, baseUrl: event.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              placeholder="http://localhost:11434"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Model
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(event) =>
                setConfig({ ...config, model: event.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              placeholder={
                config.type === 'xai' ? 'grok-4.7' : 'llama3.1'
              }
            />
          </div>

          <p className="text-xs text-slate-500">
            API keys never leave the server. Set XAI_API_KEY or OPENAI_API_KEY
            in .env.local or Vercel. Do not use NEXT_PUBLIC_ for secrets.
          </p>

          {testStatus !== 'idle' && (
            <div
              className={`p-3 rounded-lg text-sm ${
                testStatus === 'testing'
                  ? 'bg-blue-50 text-blue-700'
                  : testStatus === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
              }`}
            >
              {testStatus === 'testing'
                ? 'Testing connection...'
                : testMessage}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleTest}
            disabled={testStatus === 'testing'}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Test Connection
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
