import {
  generateAIText,
  parseAIJson,
  publicProviderStatus,
  resolveServerProviderConfig,
  testAIProviderConnection,
} from '@/utils/aiGateway';

const ORIGINAL_ENV = process.env;

function setEnv(overrides: Record<string, string | undefined>) {
  process.env = { ...ORIGINAL_ENV, ...overrides };
}

describe('AI provider gateway', () => {
  afterEach(() => {
    process.env = ORIGINAL_ENV;
    jest.restoreAllMocks();
  });

  it('defaults to Ollama with configurable URL and model', () => {
    setEnv({
      AI_PROVIDER: undefined,
      OLLAMA_BASE_URL: 'http://100.64.1.10:11434',
      OLLAMA_MODEL: 'llama3.1:8b',
      OPENAI_API_KEY: 'should-not-win',
    });

    expect(resolveServerProviderConfig()).toEqual({
      type: 'ollama',
      baseUrl: 'http://100.64.1.10:11434',
      model: 'llama3.1:8b',
    });
  });

  it('does not let a leftover Ollama URL override an env-locked xAI provider', () => {
    setEnv({
      AI_PROVIDER: 'xai',
      XAI_API_KEY: 'server-xai-key',
    });

    expect(
      resolveServerProviderConfig({
        type: 'ollama',
        baseUrl: 'http://localhost:11434',
        model: 'llama3.1',
      })
    ).toEqual({
      type: 'xai',
      baseUrl: 'https://api.x.ai/v1',
      model: 'grok-4.7',
      apiKey: 'server-xai-key',
    });
  });

  it('selects xAI Grok from env and never uses a client-supplied key', () => {
    setEnv({
      AI_PROVIDER: 'xai',
      XAI_API_KEY: 'server-xai-key',
      XAI_MODEL: 'grok-4.7',
    });

    const config = resolveServerProviderConfig({
      type: 'openai',
      apiKey: 'browser-should-never-win',
      model: 'gpt-4o-mini',
    });

    expect(config).toEqual({
      type: 'xai',
      baseUrl: 'https://api.x.ai/v1',
      model: 'grok-4.7',
      apiKey: 'server-xai-key',
    });
    expect(publicProviderStatus().hasApiKey).toBe(true);
    expect(publicProviderStatus().lockedByEnv).toBe(true);
  });

  it('accepts grok as an alias for the xAI provider', () => {
    setEnv({ AI_PROVIDER: 'grok', XAI_API_KEY: 'key' });
    expect(resolveServerProviderConfig().type).toBe('xai');
  });

  it('ignores apiKey on client hints when AI_PROVIDER is unset', () => {
    setEnv({
      AI_PROVIDER: undefined,
      XAI_API_KEY: 'env-only-key',
    });

    const config = resolveServerProviderConfig({
      type: 'xai',
      apiKey: 'from-browser',
    });

    expect(config.apiKey).toBe('env-only-key');
    expect(config.model).toBe('grok-4.7');
    expect(config.baseUrl).toBe('https://api.x.ai/v1');
  });

  it('generates with Ollama and reports a clear error when it is down', async () => {
    setEnv({ AI_PROVIDER: 'ollama' });
    global.fetch = jest.fn().mockRejectedValue(new Error('connect ECONNREFUSED'));

    await expect(
      generateAIText({
        systemPrompt: 'sys',
        userPrompt: 'hello',
      })
    ).rejects.toThrow(/Cannot reach Ollama at http:\/\/localhost:11434/);
  });

  it('sends Ollama generate requests to the local API', async () => {
    setEnv({ AI_PROVIDER: 'ollama', OLLAMA_MODEL: 'llama3.1' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ response: '  once upon a time  ' }),
    });

    await expect(
      generateAIText({
        systemPrompt: 'You are a narrator.',
        userPrompt: 'Start a story.',
      })
    ).resolves.toBe('once upon a time');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:11434/api/generate',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('sends xAI chat completions with the server key only', async () => {
    setEnv({
      AI_PROVIDER: 'xai',
      XAI_API_KEY: 'server-xai-key',
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Grok draft' } }],
      }),
    });

    await expect(
      generateAIText({
        systemPrompt: 'sys',
        userPrompt: 'write',
        providerConfig: { apiKey: 'leaked-from-browser' },
      })
    ).resolves.toBe('Grok draft');

    const [, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe(
      'https://api.x.ai/v1/chat/completions'
    );
    expect(init.headers.Authorization).toBe('Bearer server-xai-key');
    expect(JSON.parse(init.body).model).toBe('grok-4.7');
  });

  it('explains when the xAI key is missing', async () => {
    setEnv({
      AI_PROVIDER: 'xai',
      XAI_API_KEY: undefined,
    });

    await expect(
      generateAIText({
        systemPrompt: 'sys',
        userPrompt: 'write',
      })
    ).rejects.toThrow(/XAI_API_KEY is not set/);
  });

  it('explains when xAI rejects the key', async () => {
    setEnv({ AI_PROVIDER: 'xai', XAI_API_KEY: 'bad-key' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => 'invalid api key',
    });

    await expect(
      generateAIText({
        systemPrompt: 'sys',
        userPrompt: 'write',
      })
    ).rejects.toThrow(/xAI Grok rejected the request \(401\)/);
  });

  it('tests Ollama by listing tags', async () => {
    setEnv({ AI_PROVIDER: 'ollama' });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ models: [] }),
      text: async () => '',
    });

    await expect(testAIProviderConnection()).resolves.toEqual({
      provider: 'ollama',
      model: 'llama3.1',
      baseUrl: 'http://localhost:11434',
    });
  });

  it('parses fenced JSON from a model reply', () => {
    expect(
      parseAIJson<{ title: string }>('```json\n{"title":"Night Market"}\n```')
    ).toEqual({ title: 'Night Market' });
  });
});
