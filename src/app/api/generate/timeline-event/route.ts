import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { genre, chapterId, characters, type, context } = await request.json()

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

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a creative writing assistant specializing in story development and timeline creation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" }
    })

    const response = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating timeline event:', error)
    return NextResponse.json(
      { error: 'Failed to generate timeline event' },
      { status: 500 }
    )
  }
} 