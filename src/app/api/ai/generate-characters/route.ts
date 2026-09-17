import { NextResponse } from 'next/server'
import { generateAIText, parseAIJson } from '@/utils/aiGateway'
import type { AIProviderConfig } from '@/utils/aiProvider'

interface GenerateCharacterParams {
  genre?: string
  count?: number
  context?: string
  role?: 'protagonist' | 'antagonist' | 'supporting' | 'minor'
  name?: string
  existingCharacters?: Array<{ name?: string; role?: string; description?: string }>
  providerConfig?: Partial<AIProviderConfig>
}

function normalizeCharacterList(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) return parsed
  if (parsed && typeof parsed === 'object') {
    const record = parsed as { characters?: unknown }
    if (Array.isArray(record.characters)) return record.characters
    return [parsed]
  }
  return []
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateCharacterParams
    const {
      role,
      name,
      existingCharacters,
      providerConfig,
    } = body
    const genre = body.genre || 'fiction'
    const count = body.count || 1
    const existingSummary = existingCharacters?.length
      ? existingCharacters
          .map((character) => `${character.name || 'unnamed'} (${character.role || 'unknown'})`)
          .join('; ')
      : 'none'
    const context =
      body.context ||
      `Suggested name: ${name || 'unspecified'}. Existing characters: ${existingSummary}.`

    const prompt = `Generate ${count} character${count === 1 ? '' : 's'} for a ${genre} story with the following context:
${context}
${role ? `Primary Role: ${role}` : ''}
${name ? `Use this name if it fits: ${name}` : ''}

Please generate characters that:
1. Have distinct personalities and motivations
2. Fit naturally into the story context
3. Have meaningful relationships with each other
4. Contribute to the plot development
5. Have unique backgrounds and goals

Return JSON only, as an object with a "characters" array. Each character must include:
{
  "name": "string",
  "role": "protagonist" | "antagonist" | "supporting",
  "description": "string (physical and personality traits)",
  "background": "string (character's history)",
  "motivations": ["string (list of character's goals and desires)"],
  "personality": "string",
  "goals": ["string"]
}`

    const response = await generateAIText({
      systemPrompt:
        'You are a creative writing assistant that generates well-developed and memorable characters. Always respond with valid JSON.',
      userPrompt: prompt,
      providerConfig,
      temperature: 0.7,
      maxTokens: 2000,
    })

    const characters = normalizeCharacterList(parseAIJson(response))
    return NextResponse.json({ characters })
  } catch (error) {
    console.error('Error generating characters:', error)
    return NextResponse.json(
      { error: 'Failed to generate characters' },
      { status: 500 }
    )
  }
} 