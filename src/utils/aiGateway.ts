import type { AIProviderConfig, AIProviderType } from '@/utils/aiProvider';
import {
  DEFAULT_OLLAMA_BASE_URL,
  DEFAULT_OLLAMA_MODEL,
  DEFAULT_OPENAI_BASE_URL,
  DEFAULT_OPENAI_MODEL,
  DEFAULT_XAI_BASE_URL,
  DEFAULT_XAI_MODEL,
  isAIProviderType,
  stripClientApiKey,
} from '@/utils/aiProvider';

export const DEFAULT_AI_TIMEOUT_MS = 120_000;

interface GenerateAITextOptions {
  systemPrompt: string;
  userPrompt: string;
  providerConfig?: Partial<AIProviderConfig>;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function cleanBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

function readEnv(name: string): string {
  return process.env[name]?.trim() || '';
}

function envProviderType(): AIProviderType | undefined {
  const raw = readEnv('AI_PROVIDER').toLowerCase();
  if (raw === 'grok') return 'xai';
  if (isAIProviderType(raw)) return raw;
  return undefined;
}

export function defaultProviderTypeFromEnv(): AIProviderType {
  const explicit = envProviderType();
  if (explicit) return explicit;

  // Hosted Vercel backup: if an xAI key is present and nobody picked a provider, use Grok.
  if (readEnv('XAI_API_KEY') && (readEnv('VERCEL') === '1' || readEnv('VERCEL') === 'true')) {
    return 'xai';
  }

  return 'ollama';
}

function normalizeProviderType(type?: AIProviderType | string): AIProviderType {
  if (type === 'grok') return 'xai';
  if (isAIProviderType(type)) return type;
  return defaultProviderTypeFromEnv();
}

function missingKeyError(provider: 'xai' | 'openai' | 'custom'): Error {
  if (provider === 'xai') {
    return new Error(
      'xAI Grok is selected but XAI_API_KEY is not set. Add it in Vercel project settings or .env.local. Keys stay on the server and are never sent to the browser.'
    );
  }
  if (provider === 'openai') {
    return new Error(
      'OpenAI is selected but OPENAI_API_KEY is not set. Add it to the server environment. Keys stay on the server and are never sent to the browser.'
    );
  }
  return new Error(
    'A custom OpenAI-compatible provider is selected but no API key was found. Set CUSTOM_API_KEY or OPENAI_API_KEY on the server.'
  );
}

export function resolveServerProviderConfig(
  providerConfig?: Partial<AIProviderConfig>
): AIProviderConfig {
  const safe = stripClientApiKey(providerConfig);
  const type = normalizeProviderType(safe?.type);

  if (type === 'ollama') {
    return {
      type,
      baseUrl: cleanBaseUrl(
        safe?.baseUrl?.trim() || readEnv('OLLAMA_BASE_URL') || DEFAULT_OLLAMA_BASE_URL
      ),
      model: safe?.model?.trim() || readEnv('OLLAMA_MODEL') || DEFAULT_OLLAMA_MODEL,
    };
  }

  if (type === 'xai') {
    const apiKey = readEnv('XAI_API_KEY');
    if (!apiKey) throw missingKeyError('xai');
    return {
      type,
      baseUrl: cleanBaseUrl(
        safe?.baseUrl?.trim() || readEnv('XAI_BASE_URL') || DEFAULT_XAI_BASE_URL
      ),
      model: safe?.model?.trim() || readEnv('XAI_MODEL') || DEFAULT_XAI_MODEL,
      apiKey,
    };
  }

  if (type === 'custom') {
    const apiKey = readEnv('CUSTOM_API_KEY') || readEnv('OPENAI_API_KEY');
    const baseUrl = cleanBaseUrl(
      safe?.baseUrl?.trim() || readEnv('CUSTOM_BASE_URL') || readEnv('OPENAI_BASE_URL')
    );
    if (!baseUrl) {
      throw new Error(
        'A custom AI provider is selected but no base URL is set. Set CUSTOM_BASE_URL or pass a base URL in settings.'
      );
    }
    return {
      type,
      baseUrl,
      model:
        safe?.model?.trim() ||
        readEnv('CUSTOM_MODEL') ||
        readEnv('OPENAI_MODEL') ||
        DEFAULT_OPENAI_MODEL,
      apiKey: apiKey || undefined,
    };
  }

  const apiKey = readEnv('OPENAI_API_KEY');
  if (!apiKey) throw missingKeyError('openai');
  return {
    type: 'openai',
    baseUrl: cleanBaseUrl(
      safe?.baseUrl?.trim() || readEnv('OPENAI_BASE_URL') || DEFAULT_OPENAI_BASE_URL
    ),
    model: safe?.model?.trim() || readEnv('OPENAI_MODEL') || DEFAULT_OPENAI_MODEL,
    apiKey,
  };
}

export function providerDisplayName(type: AIProviderType): string {
  if (type === 'xai') return 'xAI Grok';
  if (type === 'ollama') return 'Ollama';
  if (type === 'openai') return 'OpenAI';
  return 'custom AI provider';
}

export function describeProviderUnreachable(
  config: AIProviderConfig,
  cause: unknown
): Error {
  const detail = cause instanceof Error ? cause.message : String(cause);
  if (config.type === 'ollama') {
    return new Error(
      `Cannot reach Ollama at ${config.baseUrl}. Is Ollama running? On the Windows PC, start it with "ollama serve" and confirm OLLAMA_BASE_URL. Details: ${detail}`
    );
  }
  if (config.type === 'xai') {
    return new Error(
      `Cannot reach xAI Grok at ${config.baseUrl}. Check XAI_API_KEY and that this host can access api.x.ai. Details: ${detail}`
    );
  }
  return new Error(
    `Cannot reach ${providerDisplayName(config.type)} at ${config.baseUrl}. Check the provider URL and server-side API key. Details: ${detail}`
  );
}

async function generateWithOllama(
  config: AIProviderConfig,
  systemPrompt: string,
  userPrompt: string,
  temperature: number,
  maxTokens: number,
  timeoutMs: number
): Promise<string> {
  let response: Response;
  try {
    response = await fetchWithTimeout(
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
      timeoutMs
    );
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error(
        `Ollama timed out after ${Math.round(timeoutMs / 1000)}s at ${config.baseUrl}. The previous draft was not changed.`
      );
    }
    throw describeProviderUnreachable(config, error);
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw describeProviderUnreachable(
      config,
      `HTTP ${response.status}: ${errorText}`
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
  maxTokens: number,
  timeoutMs: number
): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(
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
      timeoutMs
    );
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error(
        `${providerDisplayName(config.type)} timed out after ${Math.round(timeoutMs / 1000)}s. The previous draft was not changed.`
      );
    }
    throw describeProviderUnreachable(config, error);
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw describeProviderUnreachable(
      config,
      `HTTP ${response.status}: ${errorText}`
    );
  }

  const payload = await response.json();
  const text = payload?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error(
      `${providerDisplayName(config.type)} returned an empty response.`
    );
  }

  return text;
}

function defaultTimeoutMs(): number {
  const raw = Number(readEnv('AI_REQUEST_TIMEOUT_MS'));
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_AI_TIMEOUT_MS;
}

export async function generateAIText({
  systemPrompt,
  userPrompt,
  providerConfig,
  temperature = 0.7,
  maxTokens = 2000,
  timeoutMs = defaultTimeoutMs(),
}: GenerateAITextOptions): Promise<string> {
  const config = resolveServerProviderConfig(providerConfig);

  if (config.type === 'ollama') {
    return generateWithOllama(
      config,
      systemPrompt,
      userPrompt,
      temperature,
      maxTokens,
      timeoutMs
    );
  }

  return generateWithOpenAICompatible(
    config,
    systemPrompt,
    userPrompt,
    temperature,
    maxTokens,
    timeoutMs
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

export function publicProviderSnapshot(config: AIProviderConfig) {
  return {
    provider: config.type,
    model: config.model,
    baseUrl: config.baseUrl,
    hasApiKey: Boolean(config.apiKey),
  };
}

export async function testAIProviderConnection(
  providerConfig?: Partial<AIProviderConfig>
): Promise<{ provider: AIProviderType; model: string; baseUrl: string }> {
  const config = resolveServerProviderConfig(providerConfig);

  if (config.type === 'ollama') {
    let response: Response;
    try {
      response = await fetchWithTimeout(`${config.baseUrl}/api/tags`, {}, 15_000);
    } catch (error) {
      if (isAbortError(error)) {
        throw new Error(`Ollama timed out while checking ${config.baseUrl}/api/tags.`);
      }
      throw describeProviderUnreachable(config, error);
    }
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw describeProviderUnreachable(
        config,
        `HTTP ${response.status}: ${errorText}`
      );
    }
    return { provider: config.type, model: config.model, baseUrl: config.baseUrl };
  }

  await generateWithOpenAICompatible(
    config,
    'You are a connectivity check assistant.',
    'Reply with exactly: "Connection successful."',
    0,
    40,
    20_000
  );
  return { provider: config.type, model: config.model, baseUrl: config.baseUrl };
}
