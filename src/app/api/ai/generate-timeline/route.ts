import { NextResponse } from 'next/server'
import { generateAIText, parseAIJson } from '@/utils/aiGateway'
import type { AIProviderConfig } from '@/utils/aiProvider'

interface GenerateTimelineParams {
  chapters: Array<{
    id: string
    title: string
    content: string
  }>
  characters: Array<{
    id: string
    name: string
    role: string
    description: string
  }>
  existingEvents: Array<{
    title: string
    description: string
    date: string
    type: 'major' | 'minor'
    characters: string[]
  }>
  count?: number
  providerConfig?: Partial<AIProviderConfig>
}

export async function POST(req: Request) {
  try {
    const { chapters, characters, existingEvents, count = 3, providerConfig } = await req.json() as GenerateTimelineParams

    // Create a context-aware prompt
    const prompt = `Given the following story context, generate ${count} new timeline events that fit naturally into the narrative:

Story Chapters:
${chapters.map(chapter => `- ${chapter.title}: ${chapter.content.substring(0, 200)}...`).join('\n')}

Characters:
${characters.map(char => `- ${char.name} (${char.role}): ${char.description}`).join('\n')}

Existing Events:
${existingEvents.map(event => `- ${event.title} (${event.type}): ${event.description}`).join('\n')}

Generate ${count} new timeline events that:
1. Fit naturally into the existing story
2. Develop character arcs
3. Advance the plot
4. Include both major and minor events
5. Maintain consistency with existing events

Format each event as JSON with:
{
  "title": "Event title",
  "description": "Detailed description",
  "date": "YYYY-MM-DD",
  "type": "major" or "minor",
  "characters": ["character names involved"],
  "chapterId": "relevant chapter id"
}`

    const response = await generateAIText({
      systemPrompt:
        'You are a creative writing assistant that generates story events that fit naturally into existing narratives.',
      userPrompt: prompt,
      providerConfig,
      temperature: 0.7,
      maxTokens: 1000,
    })

    const events = parseAIJson(response)

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error generating timeline events:', error)
    return NextResponse.json(
      { error: 'Failed to generate timeline events' },
      { status: 500 }
    )
  }
} 