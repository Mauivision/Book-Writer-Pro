import { NextResponse } from 'next/server'
import { getOpenAIClient } from '@/utils/openai'

interface GenerateChapterParams {
  genre: string
  count: number
  complexity: 'beginner' | 'intermediate' | 'advanced'
  context: {
    plot: string
    characters: string
    setting: string
  }
}

export async function POST(request: Request) {
  try {
    const openai = getOpenAIClient()
    const { genre, count, complexity, context } = await request.json() as GenerateChapterParams

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a creative writing assistant that generates engaging and well-structured chapters."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const chapters = JSON.parse(response)
    return NextResponse.json(chapters)
  } catch (error) {
    console.error('Error generating chapters:', error)
    return NextResponse.json(
      { error: 'Failed to generate chapters' },
      { status: 500 }
    )
  }
} 