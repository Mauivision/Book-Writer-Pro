import { NextResponse } from 'next/server';
import { testAIProviderConnection } from '@/utils/aiGateway';
import type { AIProviderConfig } from '@/utils/aiProvider';
import { aiErrorResponse } from '@/utils/aiRoute';

interface TestConnectionRequest {
  providerConfig?: Partial<AIProviderConfig>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as TestConnectionRequest;
    const result = await testAIProviderConnection(body.providerConfig);
    return NextResponse.json({
      success: true,
      provider: result.provider,
      model: result.model,
      baseUrl: result.baseUrl,
    });
  } catch (error) {
    console.error('Error testing AI provider:', error);
    return aiErrorResponse(error, 'Connection failed.', 401);
  }
}
