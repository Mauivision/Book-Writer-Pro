import { ApiError } from './api';

class ApiClient {
  private baseUrl: string;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    this.setupOnlineStatusListener();
  }

  private setupOnlineStatusListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        console.log('App is online');
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        console.log('App is offline');
      });
    }
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;

    // Check if we're online
    if (!this.isOnline) {
      throw new ApiError(
        'No internet connection. Please check your connection and try again.'
      );
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error. Please check your connection.');
      }

      throw new ApiError('An unexpected error occurred.');
    }
  }

  // Test API key
  async testApiKey(
    apiKey: string
  ): Promise<{ valid: boolean; message: string }> {
    return this.request('/api/ai/test-key', {
      method: 'POST',
      body: JSON.stringify({ apiKey }),
    });
  }

  // Story generation
  async generateStory(params: {
    genre: string;
    theme: string;
    complexity: 'beginner' | 'intermediate' | 'advanced';
    length: 'short' | 'medium' | 'long';
    customPrompt?: string;
  }) {
    return this.request('/api/ai/generate-story', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Chapter generation
  async generateChapter(params: {
    title: string;
    prompt: string;
    style?: 'professional' | 'creative' | 'casual';
    tone?: 'formal' | 'engaging' | 'humorous';
    pov?: 'first' | 'second' | 'third';
    length?: number;
    context?: {
      plot?: string;
      characters?: string;
      setting?: string;
      genre?: string;
      theme?: string;
      previousChapters?: string[];
    };
  }) {
    return this.request('/api/ai/generate-chapter', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Chapter rewriting
  async rewriteChapter(params: {
    content: string;
    instructions: string;
    style?: 'professional' | 'creative' | 'casual';
    tone?: 'formal' | 'engaging' | 'humorous';
    context?: {
      chapterTitle?: string;
      characters?: Array<{
        id: string;
        name: string;
        role: string;
        description: string;
        background: string;
        motivations: string[];
      }>;
      plot?: {
        summary: string;
        outline: string[];
      };
      setting?: {
        description: string;
        worldBuilding?: string;
      };
      genre?: string;
      theme?: string;
    };
  }) {
    return this.request('/api/ai/rewrite-chapter', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Character generation
  async generateCharacters(params: {
    genre: string;
    count?: number;
    role?: 'protagonist' | 'antagonist' | 'supporting';
    archetype?: string;
    personalityTraits?: string[];
    setting?: string;
  }) {
    return this.request('/api/ai/generate-characters', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Plot generation
  async generatePlot(params: {
    genre: string;
    theme?: string;
    complexity?: 'simple' | 'moderate' | 'complex';
    characterRelationships?: boolean;
    plotTwist?: boolean;
    actStructure?: 'three' | 'five' | 'hero';
  }) {
    return this.request('/api/ai/generate-plot', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Setting generation
  async generateSetting(params: {
    genre: string;
    timePeriod?: string;
    realism?: 'realistic' | 'semi-realistic' | 'fantastical';
    culturalInfluences?: string[];
    climate?: string;
  }) {
    return this.request('/api/ai/generate-setting', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Text autocomplete
  async autocomplete(params: {
    currentText: string;
    context: {
      chapterId: string;
      chapterTitle: string;
      characters: Array<{
        id: string;
        name: string;
        role: string;
        description: string;
        background: string;
        motivations: string[];
      }>;
      plot: {
        summary: string;
        outline: string[];
        currentChapter: number;
      };
      setting: {
        description: string;
        worldBuilding: string;
      };
      previousContent: string;
      genre: string;
      theme: string;
    };
    completionType: 'sentence' | 'paragraph' | 'scene' | 'dialogue';
    maxWords?: number;
  }) {
    return this.request('/api/ai/autocomplete', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // AI Librarian
  async askLibrarian(params: {
    message: string;
    context: {
      bookTitle: string;
      chapterCount: number;
      characterCount: number;
      genres: string[];
      conversationHistory: string;
      currentStage?:
        | 'idea'
        | 'planning'
        | 'writing'
        | 'revision'
        | 'publishing';
      userExperience?: 'beginner' | 'intermediate' | 'advanced';
      intent?: string;
      entities?: string[];
    };
  }) {
    console.log('API Client - askLibrarian called with:', params);

    const result = await this.request('/api/ai/librarian', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    console.log('API Client - askLibrarian response:', result);
    return result;
  }

  // Timeline generation
  async generateTimeline(params: {
    chapters: Array<{
      id: string;
      title: string;
      content: string;
    }>;
    characters: Array<{
      id: string;
      name: string;
      role: string;
      description: string;
    }>;
    existingEvents: Array<{
      title: string;
      description: string;
      date: string;
      type: 'major' | 'minor';
      characters: string[];
    }>;
    count?: number;
  }) {
    return this.request('/api/ai/generate-timeline', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Timeline event generation
  async generateTimelineEvent(params: {
    genre: string;
    chapterId?: string;
    characters?: string[];
    type?: string;
    context?: string;
  }) {
    return this.request('/api/generate/timeline-event', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Check online status
  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Retry mechanism for failed requests
  async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError!;
  }
}

export const apiClient = new ApiClient();
export { ApiError };
