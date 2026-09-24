export type AIProviderType = 'ollama' | 'xai' | 'openai' | 'custom';

export interface AIProviderConfig {
  type: AIProviderType;
  baseUrl: string;
  model: string;
  apiKey?: string;
}

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

export const AI_PROVIDER_TYPES: AIProviderType[] = [
  'ollama',
  'xai',
  'openai',
  'custom',
];

export function isAIProviderType(value: unknown): value is AIProviderType {
  return (
    value === 'ollama' ||
    value === 'xai' ||
    value === 'openai' ||
    value === 'custom'
  );
}

export function getDefaultConfig(type: AIProviderType): AIProviderConfig {
  return { ...DEFAULT_CONFIGS[type] };
}

export function sanitizeClientProviderConfig(
  config?: Partial<AIProviderConfig> | null
): Partial<AIProviderConfig> | undefined {
  if (!config || typeof config !== 'object') {
    return undefined;
  }

  const sanitized: Partial<AIProviderConfig> = {};
  if (isAIProviderType(config.type)) {
    sanitized.type = config.type;
  }
  if (typeof config.baseUrl === 'string' && config.baseUrl.trim()) {
    sanitized.baseUrl = config.baseUrl.trim();
  }
  if (typeof config.model === 'string' && config.model.trim()) {
    sanitized.model = config.model.trim();
  }
  return sanitized;
}

export function loadProviderConfig(): AIProviderConfig {
  if (typeof window === 'undefined') return getDefaultConfig('ollama');
  try {
    const raw = localStorage.getItem('ai-provider-config');
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AIProviderConfig>;
      const sanitized = sanitizeClientProviderConfig(parsed);
      if (sanitized?.type) {
        return {
          ...getDefaultConfig(sanitized.type),
          ...sanitized,
        };
      }
    }
  } catch {
    // ignore corrupt local storage
  }
  return getDefaultConfig('ollama');
}

export function saveProviderConfig(config: AIProviderConfig): void {
  if (typeof window === 'undefined') return;
  const sanitized = sanitizeClientProviderConfig(config);
  const type = sanitized?.type ?? 'ollama';
  localStorage.setItem(
    'ai-provider-config',
    JSON.stringify({
      ...getDefaultConfig(type),
      ...sanitized,
    })
  );
}

export async function generateCompletion(
  systemPrompt: string,
  userPrompt: string,
  config?: AIProviderConfig
): Promise<string> {
  const cfg = config ?? loadProviderConfig();

  if (cfg.type !== 'ollama') {
    throw new Error(
      'Cloud AI providers run on the server so API keys never reach the browser. Use the in-app Test Connection button instead.'
    );
  }

  return ollamaGenerate(cfg, systemPrompt, userPrompt);
}

async function ollamaGenerate(
  cfg: AIProviderConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const res = await fetch(`${cfg.baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: cfg.model,
      prompt: `${systemPrompt}\n\n${userPrompt}`,
      stream: false,
    }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);
  const data = await res.json();
  return data.response ?? '';
}
