import { NextResponse } from 'next/server'
import { generateAIText, parseAIJson } from '@/utils/aiGateway'
import type { AIProviderConfig } from '@/utils/aiProvider'

export async function POST(request: Request) {
  try {
    const { genre, chapterId, characters, type, context, providerConfig } =
      (await request.json()) as {
        genre: string
        chapterId?: string
        characters?: string[]
        type?: string
        context?: string
        providerConfig?: Partial<AIProviderConfig>
      }

    const prompt = `Generate a ${type || 'major'} timeline event for a ${genre} story.
${context ? `Context: ${context}\n` : ''}
${characters?.length ? `Involve these characters: ${characters.join(', ')}\n` : ''}
${chapterId ? `This event should fit into chapter ${chapterId}\n` : ''}

Generate a timeline event with:
1. A compelling title
2. A detailed description
3. A specific date or time reference
4. Character involvement
5. Impact on the story

Format the response as a JSON object with these fields:
{
  "title": "string",
  "description": "string",
  "date": "string",
  "characters": ["character_id"],
  "type": "${type || 'major'}"
}`

    const responseText = await generateAIText({
      systemPrompt:
        'You are a creative writing assistant specializing in story development and timeline creation.',
      userPrompt: prompt,
      providerConfig,
      temperature: 0.7,
      maxTokens: 1000,
    })

    const response = parseAIJson(responseText)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating timeline event:', error)
    return NextResponse.json(
      { error: 'Failed to generate timeline event' },
      { status: 500 }
    )
  }
} 