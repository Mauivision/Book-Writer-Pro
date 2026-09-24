import { NextResponse } from 'next/server';
import {
  providerErrorMessage,
  testAIProviderConnection,
} from '@/utils/aiGateway';
import { sanitizeClientProviderConfig } from '@/utils/aiProvider';
import type { AIProviderConfig } from '@/utils/aiProvider';

interface TestConnectionRequest {
  apiKey?: string;
  providerConfig?: Partial<AIProviderConfig>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as TestConnectionRequest;
    const providerConfig = sanitizeClientProviderConfig(body.providerConfig);

    const result = await testAIProviderConnection(providerConfig);

    return NextResponse.json({
      success: true,
      provider: result.provider,
      model: result.model,
      baseUrl: result.baseUrl,
    });
  } catch (error) {
    console.error('Error testing AI provider:', error);
    return NextResponse.json(
      {
        error: providerErrorMessage(
          error,
          'The chosen AI provider is unreachable.'
        ),
      },
      { status: 502 }
    );
  }
}
