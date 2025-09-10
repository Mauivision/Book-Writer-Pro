// Ollama AI Integration for Book Writing
export interface BookConfig {
  title: string;
  genre: string;
  characters: string[];
  setting: string;
  plotPoints: string[];
  outputFile?: string;
}

export interface Chapter {
  title: string;
  content: string;
  wordCount: number;
}

class OllamaAI {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string = 'http://localhost:11434', model: string = 'llama3.1') {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async generateChapter(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || '';
    } catch (error) {
      console.error('Error generating chapter:', error);
      throw new Error('Failed to generate chapter. Make sure Ollama is running on localhost:11434');
    }
  }

  async createBook(config: BookConfig): Promise<Chapter[]> {
    const chapters: Chapter[] = [];
    
    try {
      // Introduction chapter
      const introPrompt = `Write an engaging opening chapter for a ${config.genre} story set in ${config.setting}. 
      Introduce ${config.characters.join(', ')} and hint at ${config.plotPoints[0]}. 
      Use vivid details, create atmosphere, and establish the tone. Aim for approximately 500 words.`;
      
      const introContent = await this.generateChapter(introPrompt);
      chapters.push({
        title: "Chapter 1: The Beginning",
        content: introContent,
        wordCount: introContent.split(/\s+/).length
      });

      // Middle chapters
      for (let i = 1; i < config.plotPoints.length - 1; i++) {
        const chapterNum = i + 1;
        const chapterPrompt = `Write chapter ${chapterNum} for a ${config.genre} story in ${config.setting}. 
        Focus on ${config.characters[0]} navigating ${config.plotPoints[i]}. 
        Include dialogue, action, and character development. Aim for approximately 600 words.`;
        
        const chapterContent = await this.generateChapter(chapterPrompt);
        chapters.push({
          title: `Chapter ${chapterNum}`,
          content: chapterContent,
          wordCount: chapterContent.split(/\s+/).length
        });
      }

      // Final chapter
      const finalPrompt = `Write the final chapter for a ${config.genre} story in ${config.setting}. 
      Resolve ${config.plotPoints[config.plotPoints.length - 1]} with ${config.characters.join(', ')}. 
      Provide a satisfying conclusion to the story. Aim for approximately 700 words.`;
      
      const finalContent = await this.generateChapter(finalPrompt);
      chapters.push({
        title: `Chapter ${config.plotPoints.length}: The End`,
        content: finalContent,
        wordCount: finalContent.split(/\s+/).length
      });

      return chapters;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  }

  async generateChapterIdea(genre: string, setting: string): Promise<string> {
    const prompt = `Generate a creative chapter idea for a ${genre} story set in ${setting}. 
    Include a brief plot point, character conflict, and setting details. Keep it concise but engaging.`;
    
    return await this.generateChapter(prompt);
  }

  async improveWriting(text: string, focus: 'dialogue' | 'description' | 'action' | 'general' = 'general'): Promise<string> {
    const focusPrompts = {
      dialogue: 'Improve the dialogue in this text. Make it more natural, character-specific, and engaging.',
      description: 'Enhance the descriptive elements in this text. Add more vivid imagery and sensory details.',
      action: 'Improve the action sequences in this text. Make them more dynamic and engaging.',
      general: 'Improve this writing. Enhance clarity, flow, and overall quality while maintaining the original voice.'
    };

    const prompt = `${focusPrompts[focus]}\n\nOriginal text:\n${text}`;
    return await this.generateChapter(prompt);
  }

  async generateCharacter(name: string, role: string, genre: string): Promise<string> {
    const prompt = `Create a detailed character profile for ${name}, a ${role} in a ${genre} story. 
    Include their background, personality traits, motivations, and key relationships. 
    Make them compelling and three-dimensional.`;
    
    return await this.generateChapter(prompt);
  }

  async generatePlotTwist(currentPlot: string, genre: string): Promise<string> {
    const prompt = `Generate a surprising plot twist for this ${genre} story. 
    Current plot: ${currentPlot}
    
    Create a twist that is unexpected but logical, and that adds depth to the story.`;
    
    return await this.generateChapter(prompt);
  }
}

// Default configurations for different genres
export const genreConfigs = {
  'Science Fiction': {
    setting: 'a futuristic space station in 2156',
    characters: ['a skilled pilot', 'an AI researcher', 'a mysterious alien'],
    plotPoints: [
      'discovering a hidden alien artifact',
      'navigating through a dangerous asteroid field',
      'uncovering a conspiracy that threatens the station',
      'forming an alliance with unexpected allies'
    ]
  },
  'Fantasy': {
    setting: 'the mystical realm of Eldoria',
    characters: ['a young mage', 'a seasoned warrior', 'a wise oracle'],
    plotPoints: [
      'finding an ancient magical artifact',
      'battling dark forces in the Shadowlands',
      'discovering the true power of friendship',
      'restoring balance to the realm'
    ]
  },
  'Mystery': {
    setting: 'a small coastal town in Maine',
    characters: ['a retired detective', 'a local librarian', 'a suspicious newcomer'],
    plotPoints: [
      'investigating a mysterious disappearance',
      'uncovering hidden family secrets',
      'following clues that lead to danger',
      'solving the case and revealing the truth'
    ]
  },
  'Romance': {
    setting: 'a charming bookstore in Paris',
    characters: ['a struggling writer', 'a successful publisher', 'a wise mentor'],
    plotPoints: [
      'meeting under unexpected circumstances',
      'overcoming personal obstacles',
      'facing a crisis that tests their relationship',
      'finding love and happiness together'
    ]
  }
};

export default OllamaAI;
