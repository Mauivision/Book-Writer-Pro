import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/utils/openai';

interface GenerateSettingParams {
  genre: string;
  theme: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  includeWorldBuilding: boolean;
}

export async function POST(request: Request) {
  try {
    const openai = getOpenAIClient();
    const { genre, theme, complexity, includeWorldBuilding } = await request.json() as GenerateSettingParams;

    const prompt = `Generate a detailed setting for a ${genre} story with the following specifications:
Theme: ${theme}
Complexity: ${complexity}
Include World Building: ${includeWorldBuilding ? 'Yes' : 'No'}

Please generate:
1. A vivid description of the main setting
2. ${includeWorldBuilding ? 'Detailed world-building elements including:' : 'Basic world elements:'}
   - History and lore
   - Geography and climate
   - Society and culture
   - Technology or magic systems
   - Political structures
   - Economic systems
3. Sensory details that bring the setting to life
4. How the setting influences the story and characters

Format the response as a JSON object with these fields:
{
  "description": "string (vivid setting description)",
  "timePeriod": "string",
  "location": "string",
  "worldBuilding": {
    "history": "string",
    "geography": "string",
    "society": "string",
    "technology": "string",
    "politics": "string",
    "economy": "string"
  },
  "sensoryDetails": {
    "sight": ["string"],
    "sound": ["string"],
    "smell": ["string"],
    "touch": ["string"],
    "taste": ["string"]
  },
  "storyInfluence": {
    "onPlot": "string",
    "onCharacters": "string",
    "onThemes": "string"
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a creative writing assistant that generates immersive and detailed story settings."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const setting = JSON.parse(response);
    return NextResponse.json(setting);
  } catch (error) {
    console.error('Error generating setting:', error);
    return NextResponse.json(
      { error: 'Failed to generate setting' },
      { status: 500 }
    );
  }
} 