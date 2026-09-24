import type { AIProviderConfig } from '@/utils/aiProvider';
import {
  getDefaultConfig,
  loadProviderConfig,
  sanitizeClientProviderConfig,
} from '@/utils/aiProvider';

export function getClientAIProviderConfig(): AIProviderConfig {
  if (typeof window === 'undefined') {
    return getDefaultConfig('ollama');
  }

  const config = loadProviderConfig();
  const sanitized = sanitizeClientProviderConfig(config);
  return {
    ...getDefaultConfig(sanitized?.type ?? config.type ?? 'ollama'),
    ...sanitized,
  };
}

export function getAIAuthToken(_config?: AIProviderConfig): string {
  return 'local-session';
}

export function attachProviderConfig<T extends Record<string, unknown>>(
  payload: T
) {
  return {
    ...payload,
    providerConfig: sanitizeClientProviderConfig(getClientAIProviderConfig()),
  };
}
