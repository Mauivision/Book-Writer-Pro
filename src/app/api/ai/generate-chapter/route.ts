import { NextResponse } from 'next/server'
import { getOpenAIClient } from '@/utils/openai'

interface GenerateChapterParams {
  title: string
  prompt: string
  style?: 'professional' | 'creative' | 'casual'
  tone?: 'formal' | 'engaging' | 'humorous'
  pov?: 'first' | 'second' | 'third'
  length?: number
  context?: {
    plot?: string
    characters?: string
    setting?: string
    genre?: string
    theme?: string
    previousChapters?: string[]
  }
}

export async function POST(request: Request) {
  try {
    const openai = getOpenAIClient()
    const { title, prompt, style = 'professional', tone = 'formal', pov = 'third', length = 1000, context } = await request.json() as GenerateChapterParams

    // Build context-aware prompt
    let contextPrompt = ''
    if (context) {
      if (context.plot) contextPrompt += `\nPlot Context: ${context.plot}`
      if (context.characters) contextPrompt += `\nCharacters: ${context.characters}`
      if (context.setting) contextPrompt += `\nSetting: ${context.setting}`
      if (context.genre) contextPrompt += `\nGenre: ${context.genre}`
      if (context.theme) contextPrompt += `\nTheme: ${context.theme}`
      if (context.previousChapters?.length) {
        contextPrompt += `\nPrevious Chapters: ${context.previousChapters.join(', ')}`
      }
    }

    const systemPrompt = `You are a creative writing assistant that generates engaging and well-structured chapters. 
    
Writing Style: ${style}
Tone: ${tone}
Point of View: ${pov}
Target Length: ${length} words

Your task is to create a chapter that:
1. Follows the user's prompt and requirements
2. Maintains consistent style and tone
3. Uses the specified point of view
4. Integrates naturally with the story context
5. Includes engaging dialogue, description, and action
6. Advances the plot and develops characters
7. Creates emotional resonance with readers`

    const userPrompt = `Generate a chapter titled "${title}" based on this prompt: "${prompt}"${contextPrompt}

Please provide the chapter in this JSON format:
{
  "title": "string (chapter title)",
  "summary": "string (brief chapter summary)",
  "content": "string (full chapter content, approximately ${length} words)",
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
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const chapter = JSON.parse(response)
    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Error generating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to generate chapter' },
      { status: 500 }
    )
  }
} 