import { NextResponse } from 'next/server';
import { generateAIText } from '@/utils/aiGateway';
import type { AIProviderConfig } from '@/utils/aiProvider';
import { aiErrorResponse } from '@/utils/aiRoute';

interface CompleteRequest {
  systemPrompt?: string;
  userPrompt?: string;
  providerConfig?: Partial<AIProviderConfig>;
  temperature?: number;
  maxTokens?: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CompleteRequest;
    if (!body.systemPrompt || !body.userPrompt) {
      return NextResponse.json(
        { error: 'systemPrompt and userPrompt are required.' },
        { status: 400 }
      );
    }

    const text = await generateAIText({
      systemPrompt: body.systemPrompt,
      userPrompt: body.userPrompt,
      providerConfig: body.providerConfig,
      temperature: body.temperature,
      maxTokens: body.maxTokens,
    });

    return NextResponse.json({ text });
  } catch (error) {
    return aiErrorResponse(error, 'AI completion failed.');
  }
}
