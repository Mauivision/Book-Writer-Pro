import OpenAI from 'openai';
import { resolveServerProviderConfig } from '@/utils/aiGateway';

export const getOpenAIClient = () => {
  const config = resolveServerProviderConfig();
  const apiKey = config.apiKey || process.env.OPENAI_API_KEY || process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'No server-side API key is configured. Set XAI_API_KEY or OPENAI_API_KEY in the environment. Keys are never read from the browser.'
    );
  }
  return new OpenAI({
    apiKey,
    baseURL: config.type === 'ollama' ? undefined : config.baseUrl,
  });
}; 