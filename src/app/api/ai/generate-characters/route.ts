import { NextResponse } from 'next/server'
import { getOpenAIClient } from '@/utils/openai'

interface GenerateCharacterParams {
  genre: string
  count: number
  context: string
  role?: 'protagonist' | 'antagonist' | 'supporting'
}

export async function POST(request: Request) {
  try {
    const openai = getOpenAIClient()
    const { genre, count, context, role } = await request.json() as GenerateCharacterParams

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a creative writing assistant that generates well-developed and memorable characters."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const characters = JSON.parse(response)
    return NextResponse.json(characters)
  } catch (error) {
    console.error('Error generating characters:', error)
    return NextResponse.json(
      { error: 'Failed to generate characters' },
      { status: 500 }
    )
  }
} 