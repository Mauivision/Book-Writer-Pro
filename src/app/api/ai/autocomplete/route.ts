import { NextResponse } from 'next/server'
import { getOpenAIClient } from '@/utils/openai'

interface AutoCompleteParams {
  currentText: string
  context: {
    chapterId: string
    chapterTitle: string
    characters: Array<{
      id: string
      name: string
      role: string
      description: string
      background: string
      motivations: string[]
    }>
    plot: {
      summary: string
      outline: string[]
      currentChapter: number
    }
    setting: {
      description: string
      worldBuilding: string
    }
    previousContent: string
    genre: string
    theme: string
  }
  completionType: 'sentence' | 'paragraph' | 'scene' | 'dialogue'
  maxWords?: number
}

export async function POST(request: Request) {
  try {
    const openai = getOpenAIClient()
    const { currentText, context, completionType, maxWords = 50 } = await request.json() as AutoCompleteParams

    // Build context-aware prompt
    const characterContext = context.characters.map(char => 
      `${char.name} (${char.role}): ${char.description}. Motivations: ${char.motivations.join(', ')}`
    ).join('\n')

    const plotContext = `Current chapter: ${context.plot.currentChapter}. Plot: ${context.plot.summary}`
    
    const prompt = `You are an intelligent writing assistant that helps complete story content based on context.

STORY CONTEXT:
Genre: ${context.genre}
Theme: ${context.theme}
Chapter: ${context.chapterTitle} (Chapter ${context.plot.currentChapter})

CHARACTERS:
${characterContext}

PLOT CONTEXT:
${plotContext}

SETTING:
${context.setting.description}

PREVIOUS CONTENT IN THIS CHAPTER:
${context.previousContent}

CURRENT TEXT TO COMPLETE:
"${currentText}"

TASK: Complete the ${completionType} starting from the current text. Consider:
1. Character voices and personalities
2. Plot progression and pacing
3. Setting consistency
4. Genre conventions
5. Theme development
6. Natural dialogue flow (if completing dialogue)
7. Scene progression (if completing a scene)

Requirements:
- Maximum ${maxWords} words
- Maintain the same writing style and tone
- Stay true to character motivations and relationships
- Advance the plot appropriately
- Include sensory details and atmosphere
- Make dialogue natural and character-specific

Provide only the completion text, starting immediately after the current text.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a creative writing assistant that provides intelligent, context-aware story completions. Always respond with natural, flowing text that continues the story seamlessly.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: Math.min(maxWords * 2, 500), // Estimate tokens needed
    })

    const responseContent = completion.choices[0].message.content
    if (!responseContent) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json({
      completion: responseContent.trim(),
      wordCount: responseContent.trim().split(/\s+/).length
    })
  } catch (error) {
    console.error('Error in auto-completion:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to complete text' },
      { status: 500 }
    )
  }
} 