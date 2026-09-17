import { NextResponse } from 'next/server';
import { testAIProviderConnection } from '@/utils/aiGateway';
import type { AIProviderConfig } from '@/utils/aiProvider';

interface TestConnectionRequest {
  apiKey?: string;
  providerConfig?: Partial<AIProviderConfig>;
}

export async function POST(request: Request) {
  try {
    const { apiKey, providerConfig } =
      (await request.json()) as TestConnectionRequest;

    const effectiveConfig: Partial<AIProviderConfig> | undefined = apiKey
      ? {
          type: 'openai',
          baseUrl: providerConfig?.baseUrl || 'https://api.openai.com/v1',
          model: providerConfig?.model || 'gpt-4o-mini',
          apiKey,
        }
      : providerConfig;

    if (!effectiveConfig && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            'No provider configured. Choose Ollama/local model or provide an API key.',
        },
        { status: 400 }
      );
    }

    const result = await testAIProviderConnection(effectiveConfig);

    return NextResponse.json({
      success: true,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    console.error('Error testing AI provider:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Connection failed' },
      { status: 401 }
    );
  }
} 