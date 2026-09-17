import { NextResponse } from 'next/server'
import { generateAIText } from '@/utils/aiGateway'
import type { AIProviderConfig } from '@/utils/aiProvider'

interface RewriteChapterParams {
  content: string
  instructions: string
  style?: 'professional' | 'creative' | 'casual'
  tone?: 'formal' | 'engaging' | 'humorous'
  context?: {
    chapterTitle?: string
    characters?: Array<{
      id: string
      name: string
      role: string
      description: string
      background: string
      motivations: string[]
    }>
    plot?: {
      summary: string
      outline: string[]
    }
    setting?: {
      description: string
      worldBuilding?: string
    }
    genre?: string
    theme?: string
  }
  providerConfig?: Partial<AIProviderConfig>
}

export async function POST(request: Request) {
  try {
    const { content, instructions, style = 'professional', tone = 'engaging', context, providerConfig } = await request.json() as RewriteChapterParams

    // Build context-aware prompt
    let contextPrompt = ''
    if (context) {
      if (context.chapterTitle) contextPrompt += `\nChapter Title: ${context.chapterTitle}`
      if (context.characters?.length) {
        contextPrompt += `\nCharacters: ${context.characters.map(c => `${c.name} (${c.role}): ${c.description}`).join(', ')}`
      }
      if (context.plot?.summary) contextPrompt += `\nPlot Context: ${context.plot.summary}`
      if (context.setting?.description) contextPrompt += `\nSetting: ${context.setting.description}`
      if (context.genre) contextPrompt += `\nGenre: ${context.genre}`
      if (context.theme) contextPrompt += `\nTheme: ${context.theme}`
    }

    const systemPrompt = `You are a creative writing assistant that helps rewrite and improve chapter content. 
    
Writing Style: ${style}
Tone: ${tone}

Your task is to rewrite the provided chapter content according to the user's instructions while:
1. Maintaining the core story and plot elements
2. Improving clarity, flow, and engagement
3. Ensuring consistency with the story context
4. Preserving character voices and personalities
5. Enhancing descriptive elements and dialogue
6. Following the specified writing style and tone
7. Making the content more compelling and readable`

    const userPrompt = `Please rewrite the following chapter content according to these instructions: "${instructions}"${contextPrompt}

ORIGINAL CONTENT:
${content}

Please provide the rewritten content that:
- Follows the user's specific instructions
- Maintains the same general structure and plot points
- Improves the writing quality and flow
- Is consistent with the story context
- Uses the specified style and tone

Return only the rewritten content without any additional commentary or formatting.`

    const response = await generateAIText({
      systemPrompt,
      userPrompt,
      providerConfig,
      temperature: 0.7,
      maxTokens: 4000,
    })

    return NextResponse.json({ 
      content: response,
      originalLength: content.length,
      newLength: response.length,
      improvements: {
        style: style,
        tone: tone,
        instructions: instructions
      }
    })
  } catch (error) {
    console.error('Error rewriting chapter:', error)
    return NextResponse.json(
      { error: 'Failed to rewrite chapter' },
      { status: 500 }
    )
  }
} 