import type { AIProviderConfig } from '@/utils/aiProvider';
import { getDefaultConfig, loadProviderConfig } from '@/utils/aiProvider';

function getLegacyOpenAIKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('openai_api_key')?.trim() || '';
}

export function getClientAIProviderConfig(): AIProviderConfig {
  if (typeof window === 'undefined') {
    return getDefaultConfig('ollama');
  }

  const config = loadProviderConfig();
  const legacyOpenAIKey = getLegacyOpenAIKey();
  const hasModernConfig = !!localStorage.getItem('ai-provider-config');

  if (!hasModernConfig && legacyOpenAIKey) {
    return {
      ...getDefaultConfig('openai'),
      apiKey: legacyOpenAIKey,
    };
  }

  if ((config.type === 'openai' || config.type === 'custom') && !config.apiKey && legacyOpenAIKey) {
    return { ...config, apiKey: legacyOpenAIKey };
  }

  return config;
}

export function getAIAuthToken(config: AIProviderConfig): string {
  return config.apiKey?.trim() || 'local-model';
}

export function attachProviderConfig<T extends Record<string, unknown>>(payload: T) {
  return {
    ...payload,
    providerConfig: getClientAIProviderConfig(),
  };
}
