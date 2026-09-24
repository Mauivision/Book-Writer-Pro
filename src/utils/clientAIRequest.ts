import type { PublicAIProviderConfig } from '@/utils/aiProvider';
import { getDefaultConfig, loadProviderConfig, stripClientApiKey } from '@/utils/aiProvider';

export function getClientAIProviderConfig(): PublicAIProviderConfig {
  if (typeof window === 'undefined') {
    return getDefaultConfig('ollama');
  }
  return loadProviderConfig();
}

export function attachProviderConfig<T extends Record<string, unknown>>(payload: T) {
  return {
    ...payload,
    providerConfig: stripClientApiKey(getClientAIProviderConfig()),
  };
}
