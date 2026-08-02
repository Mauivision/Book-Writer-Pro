import { NextResponse } from 'next/server';
import { generateAIText } from '@/utils/aiGateway';
import type { AIProviderConfig } from '@/utils/aiProvider';

interface LibrarianRequest {
  message: string;
  context?: {
    bookTitle?: string;
    chapterCount?: number;
    characterCount?: number;
    genres?: string[];
    conversationHistory?: string;
    currentStage?: string;
    userExperience?: string;
    intent?: string;
    entities?: string[];
  };
  providerConfig?: Partial<AIProviderConfig>;
}

export async function POST(request: Request) {
  try {
    const { message, context = {}, providerConfig } =
      (await request.json()) as LibrarianRequest;

    console.log('Librarian API - Received request:', { message, context });

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build conversation history for context
    let conversationHistory = '';
    if (context.conversationHistory?.length) {
      conversationHistory = '\n\nPrevious conversation:\n' + context.conversationHistory;
    }

    // Build enhanced system prompt with additional context
    const systemPrompt = `You are NovelCraft AI, a friendly and knowledgeable AI writing companion, here to help with writing and literature. 

You have access to the following book information:
- Title: ${context.bookTitle || 'Untitled Book'}
- Number of chapters: ${context.chapterCount || 0}
- Number of characters: ${context.characterCount || 0}
- Genres: ${context.genres?.join(', ') || 'Not specified'}
- Current writing stage: ${context.currentStage || 'idea'}
- User experience level: ${context.userExperience || 'beginner'}
- Detected intent: ${context.intent || 'general'}
- Key entities: ${context.entities?.join(', ') || 'none'}

${conversationHistory}

Your role is to:
1. Provide helpful writing advice and suggestions tailored to the user's experience level
2. Answer questions about literature and writing techniques
3. Help with character development and plot ideas
4. Assist with story structure and narrative flow
5. Offer constructive feedback and improvements
6. Remember previous conversations and build upon them
7. Provide specific, actionable prompts that can be used for story generation
8. Adapt your tone based on the user's current writing stage and needs
9. Be encouraging and supportive, especially for beginners
10. Offer stage-appropriate guidance and next steps

Writing Stage Guidance:
- IDEA: Help brainstorm concepts, explore genres, identify unique angles
- PLANNING: Assist with plot structure, character development, world-building
- WRITING: Provide writing tips, help with scenes, maintain consistency
- REVISION: Offer editing advice, help improve prose, check for plot holes
- PUBLISHING: Guide through formatting, cover design, marketing strategies

Always maintain a friendly, encouraging tone and provide specific, actionable advice.
When suggesting plot ideas or character development, format your responses in a way that could be easily used as a prompt for AI story generation.
Consider the user's experience level and current writing stage when providing guidance.`;

    console.log('Librarian API - System prompt:', systemPrompt);

    const response = await generateAIText({
      systemPrompt,
      userPrompt: message,
      providerConfig,
      temperature: 0.7,
      maxTokens: 1000,
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Librarian API - Error:', error);

    if (error instanceof Error && error.message.toLowerCase().includes('ollama')) {
      return NextResponse.json({
        response:
          "I couldn't reach your local model yet. If you're using Ollama, make sure it's running (`ollama serve`) and that your model is available (for example, `ollama pull llama3.1`). Then try again.",
      });
    }

    return NextResponse.json({
      response:
        "I'm having trouble connecting to your configured AI provider right now. Please check your provider settings and try again. If you're using a local model, confirm Ollama is running and the selected model is installed.",
    });
  }
} 