'use client';

import React, { useState, useEffect } from 'react';
import {
  AIProviderConfig,
  AIProviderType,
  loadProviderConfig,
  saveProviderConfig,
  getDefaultConfig,
} from '@/utils/aiProvider';

interface AISettingsProps {
  onClose: () => void;
}

const AISettings: React.FC<AISettingsProps> = ({ onClose }) => {
  const [config, setConfig] = useState<AIProviderConfig>(getDefaultConfig('ollama'));
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    setConfig(loadProviderConfig());
  }, []);

  const handleTypeChange = (type: AIProviderType) => {
    const defaults = getDefaultConfig(type);
    setConfig({ ...defaults, apiKey: type === config.type ? config.apiKey : defaults.apiKey });
    setTestStatus('idle');
  };

  const handleSave = () => {
    saveProviderConfig(config);
    onClose();
  };

  const handleTest = async () => {
    setTestStatus('testing');
    try {
      const { generateCompletion } = await import('@/utils/aiProvider');
      const result = await generateCompletion(
        'You are a helpful assistant.',
        'Reply with exactly: "Connection successful." Nothing else.',
        config
      );
      if (result) {
        setTestStatus('success');
        setTestMessage('Connected successfully!');
      } else {
        setTestStatus('error');
        setTestMessage('Empty response from AI provider.');
      }
    } catch (err) {
      setTestStatus('error');
      setTestMessage(err instanceof Error ? err.message : 'Connection failed.');
    }
  };

  const providers: { type: AIProviderType; label: string; desc: string }[] = [
    { type: 'ollama', label: 'Ollama (Local)', desc: 'Free. Runs on your machine.' },
    { type: 'openai', label: 'OpenAI', desc: 'GPT-4o, GPT-4o-mini. Requires API key.' },
    { type: 'custom', label: 'Custom API', desc: 'Any OpenAI-compatible endpoint.' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">AI Provider Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Provider selector */}
          <div className="grid grid-cols-3 gap-2">
            {providers.map(p => (
              <button
                key={p.type}
                onClick={() => handleTypeChange(p.type)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  config.type === p.type
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-medium text-sm text-slate-800">{p.label}</div>
                <div className="text-xs text-slate-500 mt-1">{p.desc}</div>
              </button>
            ))}
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Base URL</label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={e => setConfig({ ...config, baseUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              placeholder="http://localhost:11434"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
            <input
              type="text"
              value={config.model}
              onChange={e => setConfig({ ...config, model: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              placeholder="llama3.1"
            />
          </div>

          {/* API Key (only for non-ollama) */}
          {config.type !== 'ollama' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
              <input
                type="password"
                value={config.apiKey || ''}
                onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="sk-..."
              />
              <p className="text-xs text-slate-400 mt-1">Stored locally in your browser only.</p>
            </div>
          )}

          {/* Test connection */}
          {testStatus !== 'idle' && (
            <div className={`p-3 rounded-lg text-sm ${
              testStatus === 'testing' ? 'bg-blue-50 text-blue-700' :
              testStatus === 'success' ? 'bg-green-50 text-green-700' :
              'bg-red-50 text-red-700'
            }`}>
              {testStatus === 'testing' ? 'Testing connection...' : testMessage}
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
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
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
