import { NextResponse } from 'next/server'
import { generateAIText, parseAIJson } from '@/utils/aiGateway'
import type { AIProviderConfig } from '@/utils/aiProvider'

interface GenerateCharacterParams {
  genre: string
  count: number
  context: string
  role?: 'protagonist' | 'antagonist' | 'supporting'
  providerConfig?: Partial<AIProviderConfig>
}

export async function POST(request: Request) {
  try {
    const { genre, count, context, role, providerConfig } = await request.json() as GenerateCharacterParams

    const prompt = `Generate ${count} characters for a ${genre} story with the following context:
${context}
${role ? `Primary Role: ${role}` : ''}

Please generate characters that:
1. Have distinct personalities and motivations
2. Fit naturally into the story context
3. Have meaningful relationships with each other
4. Contribute to the plot development
5. Have unique backgrounds and goals

Format each character as a JSON object with these fields:
{
  "name": "string",
  "role": "protagonist" | "antagonist" | "supporting",
  "description": "string (physical and personality traits)",
  "background": "string (character's history)",
  "motivations": ["string (list of character's goals and desires)"],
  "relationships": [
    {
      "character": "string (name of related character)",
      "type": "string (type of relationship)",
      "description": "string (description of relationship)"
    }
  ],
  "arc": {
    "startingPoint": "string",
    "development": "string",
    "endingPoint": "string"
  },
  "conflicts": ["string (list of character's internal and external conflicts)"]
}`

    const response = await generateAIText({
      systemPrompt:
        'You are a creative writing assistant that generates well-developed and memorable characters.',
      userPrompt: prompt,
      providerConfig,
      temperature: 0.7,
      maxTokens: 2000,
    })

    const characters = parseAIJson(response)
    return NextResponse.json(characters)
  } catch (error) {
    console.error('Error generating characters:', error)
    return NextResponse.json(
      { error: 'Failed to generate characters' },
      { status: 500 }
    )
  }
} 