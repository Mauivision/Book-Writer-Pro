import { NextResponse } from 'next/server'
import { generateAIText, parseAIJson } from '@/utils/aiGateway'
import type { AIProviderConfig } from '@/utils/aiProvider'

interface GenerateChapterParams {
  genre: string
  count: number
  complexity: 'beginner' | 'intermediate' | 'advanced'
  context: {
    plot: string
    characters: string
    setting: string
  }
  providerConfig?: Partial<AIProviderConfig>
}

export async function POST(request: Request) {
  try {
    const { genre, count, complexity, context, providerConfig } = await request.json() as GenerateChapterParams

    const prompt = `Generate ${count} chapters for a ${genre} story with the following context:
Plot: ${context.plot}
Characters: ${context.characters}
Setting: ${context.setting}
Complexity: ${complexity}

Please generate chapters that:
1. Advance the plot naturally
2. Develop character arcs
3. Maintain consistent pacing
4. Include engaging scenes and dialogue
5. Build tension and conflict
6. Incorporate the setting effectively

Format each chapter as a JSON object with these fields:
{
  "title": "string (engaging chapter title)",
  "summary": "string (brief chapter summary)",
  "content": "string (full chapter content)",
  "keyEvents": ["string (list of key events in the chapter)"],
  "characters": [
    {
      "name": "string",
      "role": "string",
      "development": "string (how the character develops in this chapter)"
    }
  ],
  "scenes": [
    {
      "description": "string",
      "purpose": "string",
      "characters": ["string"],
      "location": "string",
      "tone": "string"
    }
  ],
  "themes": ["string (themes explored in this chapter)"],
  "conflicts": ["string (conflicts present or resolved in this chapter)"]
}`

    const response = await generateAIText({
      systemPrompt:
        'You are a creative writing assistant that generates engaging and well-structured chapters.',
      userPrompt: prompt,
      providerConfig,
      temperature: 0.7,
      maxTokens: 4000,
    })

    const chapters = parseAIJson(response)
    return NextResponse.json(chapters)
  } catch (error) {
    console.error('Error generating chapters:', error)
    return NextResponse.json(
      { error: 'Failed to generate chapters' },
      { status: 500 }
    )
  }
} 