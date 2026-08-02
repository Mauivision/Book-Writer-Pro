import { NextResponse } from 'next/server'
import { generateAIText, parseAIJson } from '@/utils/aiGateway'
import type { AIProviderConfig } from '@/utils/aiProvider'

interface GenerateStoryParams {
  genre: string
  theme: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
  length: 'short' | 'medium' | 'long'
  customPrompt?: string
  providerConfig?: Partial<AIProviderConfig>
}

export async function POST(request: Request) {
  try {
    const params: GenerateStoryParams = await request.json()

    const lengthDescription = {
      short: 'approximately 3-5 chapters',
      medium: 'approximately 8-12 chapters', 
      long: 'approximately 15-20 chapters'
    }

    const complexityDescription = {
      beginner: 'simple plot with clear character motivations',
      intermediate: 'moderate complexity with subplots and character development',
      advanced: 'complex narrative with multiple storylines and deep character arcs'
    }

    const prompt = `Create a ${params.complexity} ${params.genre} story with the theme of ${params.theme}. 
    The story should be ${params.length} in length (${lengthDescription[params.length]}).
    Complexity level: ${complexityDescription[params.complexity]}
    ${params.customPrompt ? `\n\nAdditional requirements: ${params.customPrompt}` : ''}
    
    Please provide a complete story with:
    1. A compelling title that reflects the genre and theme
    2. A brief synopsis (2-3 paragraphs)
    3. Main characters (3-5 characters) with their roles, descriptions, backgrounds, and motivations
    4. A detailed plot outline with clear story structure
    5. A rich setting description with world-building elements
    6. Initial chapters with actual content (not just summaries)
    
    Format the response as a JSON object with the following structure:
    {
      "title": "string",
      "synopsis": "string",
      "characters": [
        {
          "name": "string",
          "role": "string (protagonist/antagonist/supporting)",
          "description": "string (physical appearance and personality)",
          "background": "string (character history)",
          "motivations": ["string array"],
          "relationships": []
        }
      ],
      "plot": {
        "summary": "string (overall plot summary)",
        "outline": ["string array of plot points"],
        "subplots": ["string array of subplot descriptions"]
      },
      "setting": {
        "description": "string (main setting description)",
        "worldBuilding": "string (additional world details)"
      },
      "chapters": [
        {
          "title": "string",
          "content": "string (actual chapter content, 500-1000 words)",
          "summary": "string (brief chapter summary)"
        }
      ]
    }

    Make sure the story is engaging, well-structured, and appropriate for the specified complexity level. The chapters should have actual content, not just placeholders.`

    const responseContent = await generateAIText({
      systemPrompt:
        'You are a creative writing assistant that generates engaging, well-structured stories. Always respond with valid JSON that matches the exact structure requested.',
      userPrompt: prompt,
      providerConfig: params.providerConfig,
      temperature: 0.7,
      maxTokens: 4000,
    })

    // Try to parse the JSON response
    let story
    try {
      story = parseAIJson(responseContent)
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError)
      console.error('Raw response:', responseContent)
      throw new Error('Invalid response format from AI')
    }

    return NextResponse.json(story)
  } catch (error) {
    console.error('Error generating story:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate story' },
      { status: 500 }
    )
  }
} 