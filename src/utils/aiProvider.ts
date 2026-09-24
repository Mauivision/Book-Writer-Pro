export type AIProviderType = 'ollama' | 'xai' | 'openai' | 'custom';

export interface AIProviderConfig {
  type: AIProviderType;
  baseUrl: string;
  model: string;
  apiKey?: string;
}

/** Safe config the browser may hold. Never includes an API key. */
export type PublicAIProviderConfig = Omit<AIProviderConfig, 'apiKey'>;

export const DEFAULT_OLLAMA_BASE_URL = 'http://localhost:11434';
export const DEFAULT_OLLAMA_MODEL = 'llama3.1';
export const DEFAULT_XAI_BASE_URL = 'https://api.x.ai/v1';
export const DEFAULT_XAI_MODEL = 'grok-4.7';
export const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';
export const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';

const DEFAULT_CONFIGS: Record<AIProviderType, AIProviderConfig> = {
  ollama: {
    type: 'ollama',
    baseUrl: DEFAULT_OLLAMA_BASE_URL,
    model: DEFAULT_OLLAMA_MODEL,
  },
  xai: {
    type: 'xai',
    baseUrl: DEFAULT_XAI_BASE_URL,
    model: DEFAULT_XAI_MODEL,
  },
  openai: {
    type: 'openai',
    baseUrl: DEFAULT_OPENAI_BASE_URL,
    model: DEFAULT_OPENAI_MODEL,
  },
  custom: { type: 'custom', baseUrl: '', model: '' },
};

export function getDefaultConfig(type: AIProviderType): AIProviderConfig {
  return { ...DEFAULT_CONFIGS[type] };
}

export function isAIProviderType(value: unknown): value is AIProviderType {
  return value === 'ollama' || value === 'xai' || value === 'openai' || value === 'custom';
}

export function stripClientApiKey(
  config?: Partial<AIProviderConfig>
): Partial<PublicAIProviderConfig> | undefined {
  if (!config) return undefined;
  const { apiKey: _discarded, ...safe } = config;
  return safe;
}

export function loadProviderConfig(): PublicAIProviderConfig {
  if (typeof window === 'undefined') return getDefaultConfig('ollama');
  try {
    const raw = localStorage.getItem('ai-provider-config');
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AIProviderConfig>;
      const type = isAIProviderType(parsed.type) ? parsed.type : 'ollama';
      const defaults = getDefaultConfig(type);
      return {
        type,
        baseUrl: parsed.baseUrl?.trim() || defaults.baseUrl,
        model: parsed.model?.trim() || defaults.model,
      };
    }
  } catch {
    /* ignore corrupt localStorage */
  }
  return getDefaultConfig('ollama');
}

export function saveProviderConfig(config: PublicAIProviderConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    'ai-provider-config',
    JSON.stringify({
      type: config.type,
      baseUrl: config.baseUrl,
      model: config.model,
    })
  );
}

export async function generateCompletion(
  systemPrompt: string,
  userPrompt: string,
  config?: PublicAIProviderConfig
): Promise<string> {
  if (typeof window === 'undefined') {
    const { generateAIText } = await import('@/utils/aiGateway');
    return generateAIText({
      systemPrompt,
      userPrompt,
      providerConfig: stripClientApiKey(config),
    });
  }

  const response = await fetch('/api/ai/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({
      systemPrompt,
      userPrompt,
      providerConfig: stripClientApiKey(config ?? loadProviderConfig()),
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    text?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error || `AI request failed (${response.status})`);
  }

  if (!payload.text?.trim()) {
    throw new Error('AI provider returned an empty response.');
  }

  return payload.text;
}
