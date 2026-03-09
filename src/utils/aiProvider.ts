export type AIProviderType = 'ollama' | 'openai' | 'custom';

export interface AIProviderConfig {
  type: AIProviderType;
  baseUrl: string;
  model: string;
  apiKey?: string;
}

const DEFAULT_CONFIGS: Record<AIProviderType, AIProviderConfig> = {
  ollama: { type: 'ollama', baseUrl: 'http://localhost:11434', model: 'llama3.1' },
  openai: { type: 'openai', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini', apiKey: '' },
  custom: { type: 'custom', baseUrl: '', model: '', apiKey: '' },
};

export function getDefaultConfig(type: AIProviderType): AIProviderConfig {
  return { ...DEFAULT_CONFIGS[type] };
}

export function loadProviderConfig(): AIProviderConfig {
  if (typeof window === 'undefined') return getDefaultConfig('ollama');
  try {
    const raw = localStorage.getItem('ai-provider-config');
    if (raw) return JSON.parse(raw) as AIProviderConfig;
  } catch { /* ignore */ }
  return getDefaultConfig('ollama');
}

export function saveProviderConfig(config: AIProviderConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ai-provider-config', JSON.stringify(config));
}

export async function generateCompletion(
  systemPrompt: string,
  userPrompt: string,
  config?: AIProviderConfig
): Promise<string> {
  const cfg = config ?? loadProviderConfig();

  if (cfg.type === 'ollama') {
    return ollamaGenerate(cfg, systemPrompt, userPrompt);
  }
  return openaiCompatibleGenerate(cfg, systemPrompt, userPrompt);
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

async function openaiCompatibleGenerate(
  cfg: AIProviderConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (cfg.apiKey) headers['Authorization'] = `Bearer ${cfg.apiKey}`;

  const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: cfg.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`AI provider error (${res.status}): ${errBody || res.statusText}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}
