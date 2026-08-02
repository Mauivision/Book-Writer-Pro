import type { AIProviderConfig, AIProviderType } from '@/utils/aiProvider';

interface GenerateAITextOptions {
  systemPrompt: string;
  userPrompt: string;
  providerConfig?: Partial<AIProviderConfig>;
  temperature?: number;
  maxTokens?: number;
}

const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_OLLAMA_BASE_URL = 'http://localhost:11434';

const DEFAULT_MODELS: Record<AIProviderType, string> = {
  ollama: 'llama3.1',
  openai: 'gpt-4o-mini',
  custom: 'gpt-4o-mini',
};

function cleanBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

function normalizeProviderType(type?: AIProviderType): AIProviderType {
  if (type === 'openai' || type === 'custom' || type === 'ollama') {
    return type;
  }
  return process.env.OPENAI_API_KEY ? 'openai' : 'ollama';
}

export function resolveServerProviderConfig(
  providerConfig?: Partial<AIProviderConfig>
): AIProviderConfig {
  const type = normalizeProviderType(providerConfig?.type);
  const model = providerConfig?.model?.trim() || DEFAULT_MODELS[type];

  if (type === 'ollama') {
    const baseUrl = cleanBaseUrl(
      providerConfig?.baseUrl?.trim() ||
        process.env.OLLAMA_BASE_URL ||
        DEFAULT_OLLAMA_BASE_URL
    );
    return { type, baseUrl, model };
  }

  const baseUrl = cleanBaseUrl(
    providerConfig?.baseUrl?.trim() ||
      process.env.OPENAI_BASE_URL ||
      DEFAULT_OPENAI_BASE_URL
  );
  const apiKey =
    providerConfig?.apiKey?.trim() || process.env.OPENAI_API_KEY || '';

  return { type, baseUrl, model, apiKey };
}

async function generateWithOllama(
  config: AIProviderConfig,
  systemPrompt: string,
  userPrompt: string,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const response = await fetch(`${config.baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model,
      prompt: `${systemPrompt}\n\n${userPrompt}`,
      stream: false,
      options: {
        temperature,
        num_predict: maxTokens,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Ollama request failed (${response.status}): ${errorText}`);
  }

  const payload = await response.json();
  const text = payload?.response?.trim();
  if (!text) {
    throw new Error('Ollama returned an empty response.');
  }

  return text;
}

async function generateWithOpenAICompatible(
  config: AIProviderConfig,
  systemPrompt: string,
  userPrompt: string,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(
      `AI provider request failed (${response.status}): ${errorText}`
    );
  }

  const payload = await response.json();
  const text = payload?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('AI provider returned an empty response.');
  }

  return text;
}

export async function generateAIText({
  systemPrompt,
  userPrompt,
  providerConfig,
  temperature = 0.7,
  maxTokens = 2000,
}: GenerateAITextOptions): Promise<string> {
  const config = resolveServerProviderConfig(providerConfig);

  if (config.type === 'ollama') {
    return generateWithOllama(
      config,
      systemPrompt,
      userPrompt,
      temperature,
      maxTokens
    );
  }

  return generateWithOpenAICompatible(
    config,
    systemPrompt,
    userPrompt,
    temperature,
    maxTokens
  );
}

export function parseAIJson<T>(rawText: string): T {
  const text = rawText.trim();
  const candidates: string[] = [text];

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    candidates.unshift(fenced[1].trim());
  }

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    candidates.push(text.slice(firstBrace, lastBrace + 1));
  }

  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  if (firstBracket >= 0 && lastBracket > firstBracket) {
    candidates.push(text.slice(firstBracket, lastBracket + 1));
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as T;
    } catch {
      // Try next candidate.
    }
  }

  throw new Error('Failed to parse AI response as JSON.');
}

export async function testAIProviderConnection(
  providerConfig?: Partial<AIProviderConfig>
): Promise<{ provider: AIProviderType; model: string }> {
  const config = resolveServerProviderConfig(providerConfig);

  if (config.type === 'ollama') {
    const response = await fetch(`${config.baseUrl}/api/tags`);
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(
        `Unable to reach Ollama at ${config.baseUrl} (${response.status}): ${errorText}`
      );
    }
    return { provider: config.type, model: config.model };
  }

  await generateWithOpenAICompatible(
    config,
    'You are a connectivity check assistant.',
    'Reply with exactly: "Connection successful."',
    0,
    40
  );
  return { provider: config.type, model: config.model };
}
