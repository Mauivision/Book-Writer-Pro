import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

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
}

export async function POST(req: Request) {
  try {
    const { chapters, characters, existingEvents, count = 3 } = await req.json() as GenerateTimelineParams

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a creative writing assistant that generates story events that fit naturally into existing narratives."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Parse the response into an array of events
    const events = JSON.parse(response)

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error generating timeline events:', error)
    return NextResponse.json(
      { error: 'Failed to generate timeline events' },
      { status: 500 }
    )
  }
} 