import {
  DEFAULT_OLLAMA_BASE_URL,
  DEFAULT_OLLAMA_MODEL,
  DEFAULT_OPENAI_BASE_URL,
  DEFAULT_OPENAI_MODEL,
  DEFAULT_XAI_BASE_URL,
  DEFAULT_XAI_MODEL,
  isAIProviderType,
  sanitizeClientProviderConfig,
  type AIProviderConfig,
  type AIProviderType,
} from '@/utils/aiProvider';

interface GenerateAITextOptions {
  systemPrompt: string;
  userPrompt: string;
  providerConfig?: Partial<AIProviderConfig>;
  temperature?: number;
  maxTokens?: number;
}

const DEFAULT_MODELS: Record<AIProviderType, string> = {
  ollama: DEFAULT_OLLAMA_MODEL,
  xai: DEFAULT_XAI_MODEL,
  openai: DEFAULT_OPENAI_MODEL,
  custom: DEFAULT_OPENAI_MODEL,
};

function cleanBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export function getEnvProviderType(
  env: NodeJS.ProcessEnv = process.env
): AIProviderType | undefined {
  const raw = env.AI_PROVIDER?.trim().toLowerCase();
  if (!raw) return undefined;
  if (raw === 'grok') return 'xai';
  if (isAIProviderType(raw)) return raw;
  return undefined;
}

function normalizeProviderType(
  type: AIProviderType | undefined,
  env: NodeJS.ProcessEnv = process.env
): AIProviderType {
  return getEnvProviderType(env) || type || 'ollama';
}

function envApiKey(
  type: AIProviderType,
  env: NodeJS.ProcessEnv = process.env
): string {
  if (type === 'xai') {
    return env.XAI_API_KEY?.trim() || '';
  }
  if (type === 'openai' || type === 'custom') {
    return env.OPENAI_API_KEY?.trim() || env.CUSTOM_API_KEY?.trim() || '';
  }
  return '';
}

export function resolveServerProviderConfig(
  providerConfig?: Partial<AIProviderConfig>,
  env: NodeJS.ProcessEnv = process.env
): AIProviderConfig {
  const safeHint = sanitizeClientProviderConfig(providerConfig);
  const type = normalizeProviderType(safeHint?.type, env);

  if (type === 'ollama') {
    const baseUrl = cleanBaseUrl(
      env.OLLAMA_BASE_URL?.trim() ||
        safeHint?.baseUrl ||
        DEFAULT_OLLAMA_BASE_URL
    );
    const model =
      env.OLLAMA_MODEL?.trim() ||
      safeHint?.model ||
      DEFAULT_MODELS.ollama;
    return { type, baseUrl, model };
  }

  if (type === 'xai') {
    const baseUrl = cleanBaseUrl(
      env.XAI_BASE_URL?.trim() || safeHint?.baseUrl || DEFAULT_XAI_BASE_URL
    );
    const model =
      env.XAI_MODEL?.trim() || safeHint?.model || DEFAULT_MODELS.xai;
    return {
      type,
      baseUrl,
      model,
      apiKey: envApiKey('xai', env),
    };
  }

  const baseUrl = cleanBaseUrl(
    env.OPENAI_BASE_URL?.trim() ||
      safeHint?.baseUrl ||
      DEFAULT_OPENAI_BASE_URL
  );
  const model =
    env.OPENAI_MODEL?.trim() || safeHint?.model || DEFAULT_MODELS[type];

  return {
    type,
    baseUrl,
    model,
    apiKey: envApiKey(type, env),
  };
}

export function publicProviderStatus(
  providerConfig?: Partial<AIProviderConfig>,
  env: NodeJS.ProcessEnv = process.env
) {
  const config = resolveServerProviderConfig(providerConfig, env);
  return {
    provider: config.type,
    model: config.model,
    baseUrl: config.baseUrl,
    hasApiKey: Boolean(config.apiKey),
    lockedByEnv: Boolean(getEnvProviderType(env)),
  };
}

export function providerErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return fallback;
}

function providerLabel(type: AIProviderType): string {
  if (type === 'xai') return 'xAI Grok';
  if (type === 'ollama') return 'Ollama';
  if (type === 'openai') return 'OpenAI';
  return 'the custom AI provider';
}

function missingKeyMessage(type: AIProviderType): string | null {
  if (type === 'xai') {
    return 'XAI_API_KEY is not set. Add it on the server (.env.local or Vercel env vars). The key is never sent to the browser.';
  }
  if (type === 'openai') {
    return 'OPENAI_API_KEY is not set. Add it on the server (.env.local or Vercel env vars). The key is never sent to the browser.';
  }
  if (type === 'custom') {
    return 'OPENAI_API_KEY or CUSTOM_API_KEY is not set for this custom endpoint.';
  }
  return null;
}

function unreachableMessage(config: AIProviderConfig, detail: string): string {
  if (config.type === 'ollama') {
    return `Cannot reach Ollama at ${config.baseUrl}. Is it running? Start it with "ollama serve", confirm the model is installed (for example "ollama pull ${config.model}"), then try again. ${detail}`;
  }
  if (config.type === 'xai') {
    return `Cannot reach xAI Grok at ${config.baseUrl}. Check that XAI_API_KEY is set and https://api.x.ai/v1 is reachable. ${detail}`;
  }
  return `Cannot reach ${providerLabel(config.type)} at ${config.baseUrl}. ${detail}`;
}

async function fetchProvider(
  url: string,
  init: RequestInit,
  config: AIProviderConfig
): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'network error';
    throw new Error(unreachableMessage(config, detail));
  }
}

async function generateWithOllama(
  config: AIProviderConfig,
  systemPrompt: string,
  userPrompt: string,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const response = await fetchProvider(
    `${config.baseUrl}/api/generate`,
    {
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
    },
    config
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(
      `Ollama at ${config.baseUrl} returned ${response.status} for model "${config.model}": ${errorText}`
    );
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
  const missingKey = missingKeyMessage(config.type);
  if (missingKey && !config.apiKey) {
    throw new Error(missingKey);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  const response = await fetchProvider(
    `${config.baseUrl}/chat/completions`,
    {
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
    },
    config
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    const label = providerLabel(config.type);
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        `${label} rejected the request (${response.status}). Check the server-side API key for this provider.`
      );
    }
    throw new Error(
      `${label} request failed (${response.status}) using model "${config.model}": ${errorText}`
    );
  }

  const payload = await response.json();
  const text = payload?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error(`${providerLabel(config.type)} returned an empty response.`);
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
): Promise<{ provider: AIProviderType; model: string; baseUrl: string }> {
  const config = resolveServerProviderConfig(providerConfig);

  if (config.type === 'ollama') {
    const response = await fetchProvider(
      `${config.baseUrl}/api/tags`,
      { method: 'GET' },
      config
    );
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(
        `Unable to reach Ollama at ${config.baseUrl} (${response.status}): ${errorText}`
      );
    }
    return {
      provider: config.type,
      model: config.model,
      baseUrl: config.baseUrl,
    };
  }

  await generateWithOpenAICompatible(
    config,
    'You are a connectivity check assistant.',
    'Reply with exactly: "Connection successful."',
    0,
    40
  );
  return {
    provider: config.type,
    model: config.model,
    baseUrl: config.baseUrl,
  };
}
