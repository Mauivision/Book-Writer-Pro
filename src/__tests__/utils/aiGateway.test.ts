/**
 * @jest-environment node
 */

import {
  describeProviderUnreachable,
  generateAIText,
  resolveServerProviderConfig,
  testAIProviderConnection,
} from '@/utils/aiGateway';
import { DEFAULT_XAI_MODEL } from '@/utils/aiProvider';

const ORIGINAL_ENV = process.env;

function resetEnv(overrides: Record<string, string | undefined> = {}) {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.AI_PROVIDER;
  delete process.env.OLLAMA_BASE_URL;
  delete process.env.OLLAMA_MODEL;
  delete process.env.XAI_API_KEY;
  delete process.env.XAI_BASE_URL;
  delete process.env.XAI_MODEL;
  delete process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_BASE_URL;
  delete process.env.VERCEL;
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

describe('AI provider selection', () => {
  afterEach(() => {
    process.env = ORIGINAL_ENV;
    jest.restoreAllMocks();
  });

  it('defaults to Ollama with configurable URL and model', () => {
    resetEnv({
      OLLAMA_BASE_URL: 'http://100.64.1.10:11434',
      OLLAMA_MODEL: 'llama3.2',
    });

    expect(resolveServerProviderConfig()).toEqual({
      type: 'ollama',
      baseUrl: 'http://100.64.1.10:11434',
      model: 'llama3.2',
    });
  });

  it('selects xAI Grok from env and keeps the key on the server', () => {
    resetEnv({
      AI_PROVIDER: 'xai',
      XAI_API_KEY: 'xai-secret-from-env',
    });

    const config = resolveServerProviderConfig({
      type: 'xai',
      apiKey: 'should-never-be-used',
      model: '',
    });

    expect(config).toEqual({
      type: 'xai',
      baseUrl: 'https://api.x.ai/v1',
      model: DEFAULT_XAI_MODEL,
      apiKey: 'xai-secret-from-env',
    });
    expect(config.apiKey).not.toBe('should-never-be-used');
  });

  it('throws a clear error when xAI is selected without a server key', () => {
    resetEnv({ AI_PROVIDER: 'xai' });
    expect(() => resolveServerProviderConfig()).toThrow(/XAI_API_KEY/);
  });

  it('uses xAI on Vercel when a key is present even if AI_PROVIDER is unset', () => {
    resetEnv({
      VERCEL: '1',
      XAI_API_KEY: 'xai-on-vercel',
    });

    expect(resolveServerProviderConfig().type).toBe('xai');
  });

  it('ignores a client-supplied API key for every provider', () => {
    resetEnv({
      AI_PROVIDER: 'ollama',
    });

    const config = resolveServerProviderConfig({
      type: 'ollama',
      apiKey: 'browser-key',
    });

    expect(config.apiKey).toBeUndefined();
  });

  it('explains when Ollama is unreachable', async () => {
    resetEnv();
    global.fetch = jest.fn().mockRejectedValue(new Error('connect ECONNREFUSED'));

    await expect(
      generateAIText({
        systemPrompt: 'sys',
        userPrompt: 'hello',
      })
    ).rejects.toThrow(/Cannot reach Ollama/);
  });

  it('explains when xAI Grok is unreachable', async () => {
    resetEnv({
      AI_PROVIDER: 'xai',
      XAI_API_KEY: 'xai-secret',
    });
    global.fetch = jest.fn().mockRejectedValue(new Error('getaddrinfo ENOTFOUND'));

    await expect(
      generateAIText({
        systemPrompt: 'sys',
        userPrompt: 'hello',
        providerConfig: { type: 'xai' },
      })
    ).rejects.toThrow(/Cannot reach xAI Grok/);
  });

  it('sends xAI chat completions with the server key, not a client key', async () => {
    resetEnv({
      AI_PROVIDER: 'xai',
      XAI_API_KEY: 'server-xai-key',
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Once upon a time' } }],
      }),
    });

    const text = await generateAIText({
      systemPrompt: 'You write books.',
      userPrompt: 'Open the scene.',
      providerConfig: { type: 'xai', apiKey: 'client-key' },
    });

    expect(text).toBe('Once upon a time');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.x.ai/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer server-xai-key',
        }),
      })
    );
    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.model).toBe(DEFAULT_XAI_MODEL);
  });

  it('tests an Ollama connection against /api/tags', async () => {
    resetEnv();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ models: [] }),
    });

    await expect(testAIProviderConnection()).resolves.toMatchObject({
      provider: 'ollama',
      model: 'llama3.1',
    });
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:11434/api/tags');
  });

  it('builds a readable unreachable error', () => {
    const error = describeProviderUnreachable(
      {
        type: 'ollama',
        baseUrl: 'http://localhost:11434',
        model: 'llama3.1',
      },
      new Error('ECONNREFUSED')
    );
    expect(error.message).toContain('ollama serve');
  });
});
