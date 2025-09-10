import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Check if API key is available
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OPENAI_API_KEY is not set in environment variables');
}

const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
}) : null;

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json();

    console.log('Librarian API - Received request:', { message, context });

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI is configured
    if (!openai) {
      return NextResponse.json({
        response: `I'd love to help you with your writing! However, I need to be properly configured first. 

To get me working:
1. Create a file called '.env.local' in your project root
2. Add your OpenAI API key: OPENAI_API_KEY=your_api_key_here
3. Restart the development server

For now, here are some general writing tips:
• Start with a clear concept and outline
• Develop compelling characters with clear motivations
• Show, don't tell - use action and dialogue
• Write regularly, even if just a little each day
• Don't worry about perfection in your first draft

What kind of story are you thinking about writing? I'd love to hear your ideas!`
      });
    }

    // Build conversation history for context
    let conversationHistory = '';
    if (context.conversationHistory && context.conversationHistory.length > 0) {
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

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;

    console.log('Librarian API - OpenAI response:', response);

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Librarian API - Error:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        return NextResponse.json({
          response: `I'm having trouble connecting to my AI services right now. This usually means the OpenAI API key isn't configured properly.

To fix this:
1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. Create a file called '.env.local' in your project root
3. Add: OPENAI_API_KEY=your_api_key_here
4. Restart the development server

For now, here are some writing tips:
• Start with a simple outline of your story
• Write your first draft without worrying about perfection
• Read widely in your chosen genre
• Join a writing group for feedback and motivation

What's your story about? I'd love to hear your ideas!`
        });
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json({
          response: "I'm getting a lot of requests right now. Please wait a moment and try again. In the meantime, here are some writing prompts to get you started:\n\n• What if your main character discovered a secret that changed everything?\n• Write a scene where two characters meet for the first time\n• Describe a place that feels both familiar and strange"
        });
      }
    }

    return NextResponse.json({
      response: "I'm having some technical difficulties right now, but I'm still here to help! Here are some writing tips:\n\n• Write every day, even if just for 15 minutes\n• Don't edit while you're writing your first draft\n• Read your work aloud to catch awkward phrasing\n• Take breaks when you feel stuck\n\nWhat would you like to work on today?"
    });
  }
} 