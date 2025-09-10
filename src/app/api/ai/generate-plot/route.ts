import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/utils/openai';

interface GeneratePlotParams {
  genre: string;
  theme: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  includeSubplots: boolean;
}

export async function POST(request: Request) {
  try {
    const openai = getOpenAIClient();
    const { genre, theme, complexity, includeSubplots } = await request.json() as GeneratePlotParams;

    const prompt = `Generate a plot outline for a ${genre} story with the following specifications:
Theme: ${theme}
Complexity: ${complexity}
Include Subplots: ${includeSubplots ? 'Yes' : 'No'}

Please generate:
1. A main plot outline with key events
2. ${includeSubplots ? '2-3 subplots that complement the main plot' : 'No subplots needed'}
3. Character arcs that drive the plot
4. Major plot points and turning points
5. A satisfying resolution

Format the response as a JSON object with these fields:
{
  "summary": "string (brief plot summary)",
  "mainPlot": {
    "outline": "string (detailed plot outline)",
    "keyEvents": ["string (list of key events)"],
    "turningPoints": ["string (list of major turning points)"]
  },
  "subplots": [
    {
      "description": "string",
      "keyEvents": ["string"],
      "connectionToMainPlot": "string"
    }
  ],
  "characterArcs": [
    {
      "character": "string",
      "arc": "string",
      "impactOnPlot": "string"
    }
  ],
  "resolution": {
    "description": "string",
    "looseEnds": ["string"],
    "thematicElements": ["string"]
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a creative writing assistant that generates engaging and well-structured plot outlines."
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

    const plot = JSON.parse(response);
    return NextResponse.json(plot);
  } catch (error) {
    console.error('Error generating plot:', error);
    return NextResponse.json(
      { error: 'Failed to generate plot' },
      { status: 500 }
    );
  }
} 