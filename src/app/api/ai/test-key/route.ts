import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Test the API key with a simple request
    const openai = new OpenAI({ apiKey });
    await openai.models.list();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error testing API key:', error);
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    );
  }
} 