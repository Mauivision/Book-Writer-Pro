import { apiClient } from './apiClient';

export interface AIBrainContext {
  bookTitle: string;
  chapterCount: number;
  characterCount: number;
  genres: string[];
  plot?: {
    summary: string;
    outline: string[];
  };
  characters?: Array<{
    id: string;
    name: string;
    role: string;
    description: string;
    background: string;
    motivations: string[];
  }>;
  setting?: {
    description: string;
    worldBuilding: string;
  };
  currentStage: 'idea' | 'planning' | 'writing' | 'revision' | 'publishing';
  writingGoals?: string[];
  userExperience?: 'beginner' | 'intermediate' | 'advanced';
  writingProgress?: {
    wordsWritten: number;
    chaptersCompleted: number;
    dailyGoal: number;
    streak: number;
  };
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  questions?: string[];
  nextSteps?: string[];
  mood: 'encouraging' | 'analytical' | 'creative' | 'supportive' | 'celebratory';
  actions?: string[];
  stageGuidance?: {
    currentStage: string;
    nextStage: string;
    progress: number;
    tips: string[];
  };
  writingInsights?: {
    styleAnalysis?: string;
    pacingNotes?: string;
    characterDevelopment?: string;
    plotConsistency?: string;
  };
}

export interface ConversationMemory {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    context?: any;
    intent?: string;
    mood?: string;
  }>;
  userPreferences: {
    writingStyle: string;
    preferredGenres: string[];
    experienceLevel: string;
    goals: string[];
    preferredTone: 'casual' | 'professional' | 'encouraging' | 'analytical';
    writingSpeed: 'slow' | 'moderate' | 'fast';
  };
  storyElements: {
    themes: string[];
    conflicts: string[];
    characterArcs: string[];
    plotPoints: string[];
    settings: string[];
    tone: string;
  };
  writingStats: {
    totalWords: number;
    averageWordsPerSession: number;
    longestSession: number;
    favoriteWritingTime: string;
    commonChallenges: string[];
  };
  stageProgress: {
    idea: { completed: boolean; insights: string[] };
    planning: { completed: boolean; insights: string[] };
    writing: { completed: boolean; insights: string[] };
    revision: { completed: boolean; insights: string[] };
    publishing: { completed: boolean; insights: string[] };
  };
}

class AIBrain {
  private memory: ConversationMemory;
  private context: AIBrainContext;
  private personality: {
    name: string;
    traits: string[];
    expertise: string[];
    communicationStyle: string;
  };

  constructor() {
    this.memory = {
      messages: [],
      userPreferences: {
        writingStyle: '',
        preferredGenres: [],
        experienceLevel: 'beginner',
        goals: [],
        preferredTone: 'encouraging',
        writingSpeed: 'moderate'
      },
      storyElements: {
        themes: [],
        conflicts: [],
        characterArcs: [],
        plotPoints: [],
        settings: [],
        tone: ''
      },
      writingStats: {
        totalWords: 0,
        averageWordsPerSession: 0,
        longestSession: 0,
        favoriteWritingTime: '',
        commonChallenges: []
      },
      stageProgress: {
        idea: { completed: false, insights: [] },
        planning: { completed: false, insights: [] },
        writing: { completed: false, insights: [] },
        revision: { completed: false, insights: [] },
        publishing: { completed: false, insights: [] }
      }
    };
    this.context = {
      bookTitle: '',
      chapterCount: 0,
      characterCount: 0,
      genres: [],
      currentStage: 'idea'
    };
    this.personality = {
      name: 'NovelCraft AI',
      traits: ['encouraging', 'knowledgeable', 'creative', 'patient', 'analytical'],
      expertise: ['storytelling', 'character development', 'plot structure', 'writing techniques', 'genre conventions'],
      communicationStyle: 'conversational and supportive'
    };
  }

  // Initialize the AI brain with current book context
  initialize(context: AIBrainContext) {
    this.context = { ...this.context, ...context };
    this.loadMemory();
    this.updateStageProgress();
  }

  // Load conversation memory from localStorage
  private loadMemory() {
    if (typeof window !== 'undefined') {
      const savedMemory = localStorage.getItem('ai-brain-memory');
      if (savedMemory) {
        try {
          this.memory = JSON.parse(savedMemory);
        } catch (error) {
          console.error('Error loading AI brain memory:', error);
        }
      }
    }
  }

  // Save conversation memory to localStorage
  private saveMemory() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai-brain-memory', JSON.stringify(this.memory));
    }
  }

  // Add a message to memory with enhanced context
  private addToMemory(role: 'user' | 'assistant', content: string, context?: any, intent?: string, mood?: string) {
    this.memory.messages.push({
      role,
      content,
      timestamp: new Date(),
      context,
      intent,
      mood
    });
    
    // Keep only last 50 messages to prevent memory bloat
    if (this.memory.messages.length > 50) {
      this.memory.messages = this.memory.messages.slice(-50);
    }
    
    this.saveMemory();
  }

  // Update writing stage progress based on current context
  private updateStageProgress() {
    const { chapters, characters, plot, setting } = this.context;
    
    // Idea stage - completed if we have any story elements
    if (plot?.summary || characters?.length > 0 || setting?.description) {
      this.memory.stageProgress.idea.completed = true;
    }
    
    // Planning stage - completed if we have plot and characters
    if (plot?.summary && characters?.length > 0) {
      this.memory.stageProgress.planning.completed = true;
    }
    
    // Writing stage - in progress if we have chapters
    if (chapters > 0) {
      this.memory.stageProgress.writing.completed = chapters > 5; // Consider complete after 5 chapters
    }
    
    this.saveMemory();
  }

  // Enhanced intent analysis with more sophisticated pattern matching
  private analyzeIntent(input: string): {
    intent: string;
    confidence: number;
    entities: string[];
    emotions: string[];
    urgency: 'low' | 'medium' | 'high';
  } {
    const lowerInput = input.toLowerCase();
    
    // Enhanced intent classification
    const intents = {
      'story_help': ['story', 'plot', 'narrative', 'storyline', 'arc', 'structure'],
      'character_help': ['character', 'protagonist', 'antagonist', 'personality', 'development', 'motivation'],
      'writing_advice': ['write', 'writing', 'style', 'technique', 'tips', 'improve', 'better'],
      'brainstorming': ['idea', 'brainstorm', 'concept', 'inspiration', 'creative', 'imagine'],
      'revision_help': ['edit', 'revise', 'improve', 'fix', 'rewrite', 'polish', 'refine'],
      'publishing_help': ['publish', 'publishing', 'market', 'book cover', 'format', 'export'],
      'general_question': ['what', 'how', 'why', 'when', 'where', 'which', 'can you'],
      'encouragement': ['stuck', 'blocked', 'difficult', 'hard', 'help', 'frustrated', 'overwhelmed'],
      'progress_check': ['progress', 'how am i doing', 'milestone', 'goal', 'achievement', 'stats'],
      'stage_guidance': ['stage', 'phase', 'next step', 'what should i do', 'guidance'],
      'writing_analysis': ['analyze', 'review', 'feedback', 'critique', 'assessment', 'evaluate']
    };

    // Emotion detection
    const emotions = {
      'frustrated': ['frustrated', 'annoyed', 'angry', 'mad', 'upset'],
      'excited': ['excited', 'thrilled', 'amazed', 'wow', 'awesome'],
      'confused': ['confused', 'unsure', 'uncertain', 'doubt', 'question'],
      'motivated': ['motivated', 'inspired', 'energized', 'ready', 'excited'],
      'overwhelmed': ['overwhelmed', 'stressed', 'too much', 'complicated', 'complex']
    };

    let bestIntent = 'general_question';
    let bestConfidence = 0;
    const entities: string[] = [];
    const detectedEmotions: string[] = [];

    // Analyze intent
    for (const [intent, keywords] of Object.entries(intents)) {
      const matches = keywords.filter(keyword => lowerInput.includes(keyword));
      const confidence = matches.length / keywords.length;
      
      if (confidence > bestConfidence) {
        bestConfidence = confidence;
        bestIntent = intent;
      }
      
      entities.push(...matches);
    }

    // Analyze emotions
    for (const [emotion, keywords] of Object.entries(emotions)) {
      const matches = keywords.filter(keyword => lowerInput.includes(keyword));
      if (matches.length > 0) {
        detectedEmotions.push(emotion);
      }
    }

    // Determine urgency based on keywords and emotions
    const urgencyKeywords = ['urgent', 'quick', 'fast', 'now', 'immediately', 'asap'];
    const urgency = urgencyKeywords.some(keyword => lowerInput.includes(keyword)) || 
                   detectedEmotions.includes('frustrated') || 
                   detectedEmotions.includes('overwhelmed') ? 'high' : 'medium';

    return {
      intent: bestIntent,
      confidence: bestConfidence,
      entities: Array.from(new Set(entities)),
      emotions: detectedEmotions,
      urgency
    };
  }

  // Generate contextual response based on intent, memory, and current stage
  private async generateContextualResponse(
    input: string,
    intent: string,
    entities: string[],
    emotions: string[],
    urgency: 'low' | 'medium' | 'high'
  ): Promise<AIResponse> {
    const conversationHistory = this.memory.messages
      .slice(-10)
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Build comprehensive context for AI
    const contextPrompt = this.buildContextPrompt(intent, emotions, urgency);
    
    console.log('AI Brain - Generating contextual response:', {
      input,
      intent,
      entities,
      emotions,
      urgency,
      context: this.context
    });

    try {
      // Use the AI librarian endpoint for enhanced responses
      const response = await apiClient.askLibrarian({
        message: input,
        context: {
          bookTitle: this.context.bookTitle,
          chapterCount: this.context.chapterCount,
          characterCount: this.context.characterCount,
          genres: this.context.genres,
          conversationHistory,
          currentStage: this.context.currentStage,
          userExperience: this.context.userExperience,
          intent,
          entities
        }
      });

      return this.parseEnhancedResponse(response.response, intent, emotions);
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.generateFallbackResponse(intent, emotions);
    }
  }

  // Enhanced local AI response system that works without API
  private generateEnhancedLocalResponse(
    input: string,
    intent: string,
    entities: string[],
    emotions: string[],
    urgency: 'low' | 'medium' | 'high'
  ): AIResponse {
    const lowerInput = input.toLowerCase();
    const { currentStage, bookTitle, chapterCount, characterCount, genres } = this.context;
    
    // Stage-specific guidance
    const stageGuidance = this.getStageSpecificGuidance(currentStage, intent);
    
    // Intent-specific responses
    const intentResponse = this.getIntentSpecificResponse(intent, entities, emotions);
    
    // Context-aware suggestions
    const contextSuggestions = this.getContextAwareSuggestions(currentStage, entities);
    
    // Emotional support
    const emotionalSupport = this.getEmotionalSupport(emotions, urgency);
    
    // Combine all responses
    const fullResponse = `${intentResponse}\n\n${stageGuidance}\n\n${contextSuggestions}\n\n${emotionalSupport}`;
    
    return {
      message: fullResponse,
      suggestions: this.extractSuggestions(fullResponse),
      questions: this.extractQuestions(fullResponse),
      nextSteps: this.getNextSteps(currentStage, intent),
      mood: this.determineMood(intent, emotions, fullResponse),
      actions: this.getSuggestedActions(intent, currentStage),
      stageGuidance: {
        currentStage,
        nextStage: this.getNextStage(currentStage),
        progress: this.calculateStageProgress(currentStage),
        tips: this.getStageTips(currentStage)
      }
    };
  }

  // Get stage-specific guidance
  private getStageSpecificGuidance(stage: string, intent: string): string {
    const guidance = {
      idea: {
        general: "You're in the exciting idea phase! This is where creativity flows freely.",
        plot: "Consider what makes your story unique. What's the central conflict that drives everything?",
        character: "Think about who your main character is and what they want most in the world.",
        setting: "Where does your story take place? How does the setting influence the plot?"
      },
      planning: {
        general: "Great! You're planning your story structure. This foundation will make writing much easier.",
        plot: "Map out your major plot points. Remember: setup, confrontation, resolution.",
        character: "Develop character arcs. How will your characters change throughout the story?",
        setting: "Build your world with specific details that serve your plot."
      },
      writing: {
        general: "You're actively writing! This is where the magic happens.",
        plot: "Keep your plot outline handy but don't be afraid to let the story evolve.",
        character: "Let your characters drive the action. What would they naturally do?",
        setting: "Use setting details to enhance mood and advance the plot."
      },
      revision: {
        general: "Revision time! This is where good writing becomes great writing.",
        plot: "Look for plot holes and ensure every scene advances the story.",
        character: "Check that character actions are consistent with their motivations.",
        setting: "Ensure setting details are consistent and purposeful."
      },
      publishing: {
        general: "Almost there! You're ready to share your story with the world.",
        plot: "Your plot is solid. Focus on presentation and marketing now.",
        character: "Your characters are compelling. Highlight what makes them special.",
        setting: "Your world is rich. Use it to attract readers."
      }
    };

    return guidance[stage]?.[intent] || guidance[stage]?.general || "Keep moving forward with your writing journey!";
  }

  // Get intent-specific responses
  private getIntentSpecificResponse(intent: string, entities: string[], emotions: string[]): string {
    const responses = {
      story_help: `I can see you're working on your story! Based on what you have so far, here are some key areas to focus on:

• Plot Structure: Every story needs a clear beginning, middle, and end
• Character Development: Make sure your characters have clear goals and motivations
• Conflict: What's standing in the way of your protagonist achieving their goal?
• Pacing: Balance action scenes with quieter character moments

What specific aspect of your story would you like to work on?`,

      character_help: `Character development is crucial for a compelling story! Here's what makes characters memorable:

• Clear Motivation: What does your character want more than anything?
• Internal Conflict: What's holding them back from achieving their goal?
• Growth Arc: How will they change throughout the story?
• Unique Voice: How do they speak and act differently from other characters?

Tell me about your main character. What's their biggest challenge?`,

      writing_advice: `Great question! Here are some proven writing techniques:

• Show, Don't Tell: Use action and dialogue instead of exposition
• Active Voice: Make your sentences dynamic and engaging
• Sensory Details: Engage all five senses to bring scenes to life
• Dialogue Tags: Keep them simple and let the dialogue speak for itself
• Pacing: Vary sentence length for rhythm and flow

What specific writing challenge are you facing?`,

      brainstorming: `Brainstorming is one of my favorite parts! Here are some creative techniques:

• What If Questions: "What if your character discovered a secret?"
• Character Interviews: Ask your characters questions about their lives
• Mind Mapping: Start with a central idea and branch out
• Free Writing: Write without stopping for 10 minutes
• Genre Mashups: Combine elements from different genres

What's your central story idea? Let's explore it together!`,

      revision_help: `Revision is where the magic happens! Here's a systematic approach:

• Big Picture First: Check plot structure and character arcs
• Scene by Scene: Ensure each scene advances the story
• Line by Line: Polish your prose and dialogue
• Read Aloud: Catch awkward phrasing and rhythm issues
• Take Breaks: Fresh eyes catch more problems

What aspect of revision would you like to focus on?`,

      encouragement: `I can sense you're feeling a bit stuck, and that's completely normal! Every writer goes through this. Here's what helps:

• Remember: First drafts are supposed to be messy
• Take small steps: Even 100 words a day adds up
• Change your environment: Try writing in a different location
• Read something inspiring: Good writing often sparks creativity
• Talk it out: Sometimes explaining your story reveals solutions

What's the smallest step you can take right now?`
    };

    return responses[intent] || responses.encouragement;
  }

  // Get context-aware suggestions
  private getContextAwareSuggestions(stage: string, entities: string[]): string {
    const suggestions = {
      idea: [
        "Try writing a one-sentence summary of your story",
        "List 10 possible conflicts your character could face",
        "Brainstorm 5 different endings for your story",
        "Write a character bio for your protagonist",
        "Describe your story's setting in detail"
      ],
      planning: [
        "Create a three-act structure outline",
        "Map out your character's journey",
        "List the major plot points",
        "Develop subplot ideas",
        "Plan your story's timeline"
      ],
      writing: [
        "Set a daily word count goal",
        "Write the scene you're most excited about",
        "Try writing from a different character's perspective",
        "Add sensory details to your current scene",
        "Include a moment of conflict or tension"
      ],
      revision: [
        "Read your work aloud to catch awkward phrasing",
        "Check that every scene advances the plot",
        "Ensure character actions are consistent",
        "Look for opportunities to show instead of tell",
        "Verify that your ending resolves the main conflict"
      ]
    };

    const stageSuggestions = suggestions[stage] || suggestions.idea;
    return `Here are some specific actions you can take right now:\n\n${stageSuggestions.map(s => `• ${s}`).join('\n')}`;
  }

  // Get emotional support
  private getEmotionalSupport(emotions: string[], urgency: string): string {
    if (emotions.includes('frustrated') || emotions.includes('overwhelmed')) {
      return `I can tell you're feeling a bit overwhelmed, and that's totally normal! Writing a book is a big undertaking. Remember:
• Every great book started as a rough draft
• You don't have to figure everything out at once
• Small progress is still progress
• It's okay to take breaks when you need them

What's one small thing you can do today to move forward?`;
    }

    if (emotions.includes('excited') || emotions.includes('motivated')) {
      return `Your enthusiasm is contagious! This is the perfect energy for creative work. Channel it into:
• Writing that scene you've been thinking about
• Developing that character idea
• Exploring that plot twist
• Building that world detail

What are you most excited to work on right now?`;
    }

    if (emotions.includes('confused') || emotions.includes('unsure')) {
      return `It's natural to feel uncertain when you're creating something new. Here's what helps:
• Start with what you know for sure
• Ask yourself simple questions about your story
• Look at stories you love for inspiration
• Remember that confusion often leads to discovery

What's one thing about your story that you're certain about?`;
    }

    return `You're doing great! Every writer's journey is unique, and you're making progress every day. Keep going!`;
  }

  // Get next steps
  private getNextSteps(currentStage: string, intent: string): string[] {
    const nextSteps = {
      idea: [
        "Write a one-paragraph summary of your story",
        "List 3-5 key characters and their roles",
        "Identify the main conflict and stakes",
        "Choose a genre and target audience",
        "Create a simple outline of major events"
      ],
      planning: [
        "Develop detailed character profiles",
        "Create a three-act plot structure",
        "Build your story world and setting",
        "Plan major plot points and twists",
        "Outline your first few chapters"
      ],
      writing: [
        "Set a daily writing goal",
        "Write your first chapter",
        "Develop your opening scene",
        "Create character dialogue",
        "Build tension and conflict"
      ],
      revision: [
        "Read your entire manuscript",
        "Identify major plot issues",
        "Polish character development",
        "Improve prose and dialogue",
        "Check for consistency"
      ]
    };

    return nextSteps[currentStage] || nextSteps.idea;
  }

  // Get suggested actions
  private getSuggestedActions(intent: string, currentStage: string): string[] {
    const actions = {
      story_help: [
        "Help me outline my plot",
        "Brainstorm character ideas",
        "Develop my story world",
        "Plan my story structure"
      ],
      character_help: [
        "Create character profiles",
        "Develop character arcs",
        "Write character dialogue",
        "Plan character relationships"
      ],
      writing_advice: [
        "Show me writing techniques",
        "Help with scene building",
        "Improve my dialogue",
        "Work on pacing"
      ],
      brainstorming: [
        "Generate plot ideas",
        "Create character concepts",
        "Develop setting details",
        "Explore story themes"
      ]
    };

    return actions[intent] || ["Tell me about your story", "Get writing help", "Plan my book"];
  }

  // Get next stage
  private getNextStage(currentStage: string): string {
    const stageOrder = ['idea', 'planning', 'writing', 'revision', 'publishing'];
    const currentIndex = stageOrder.indexOf(currentStage);
    return currentIndex < stageOrder.length - 1 ? stageOrder[currentIndex + 1] : currentStage;
  }

  // Calculate stage progress
  private calculateStageProgress(currentStage: string): number {
    const stageOrder = ['idea', 'planning', 'writing', 'revision', 'publishing'];
    const currentIndex = stageOrder.indexOf(currentStage);
    return Math.round(((currentIndex + 1) / stageOrder.length) * 100);
  }

  // Get stage tips
  private getStageTips(currentStage: string): string[] {
    const tips = {
      idea: [
        "Don't worry about perfection - just get ideas down",
        "Explore multiple concepts before committing",
        "Consider what makes your story unique",
        "Think about your target audience"
      ],
      planning: [
        "Start with a simple outline and build up",
        "Focus on major plot points first",
        "Develop characters before writing",
        "Plan your world-building details"
      ],
      writing: [
        "Write regularly, even if just a little",
        "Don't edit while writing your first draft",
        "Let your characters guide the story",
        "Trust your instincts"
      ],
      revision: [
        "Take breaks between revision sessions",
        "Read your work aloud",
        "Get feedback from others",
        "Focus on big issues first"
      ]
    };

    return tips[currentStage] || tips.idea;
  }

  // Build comprehensive context prompt for AI
  private buildContextPrompt(intent: string, emotions: string[], urgency: string): string {
    const { currentStage, bookTitle, chapterCount, characterCount, genres } = this.context;
    const { userPreferences, storyElements, stageProgress } = this.memory;

    return `
You are ${this.personality.name}, an AI writing companion. 

CURRENT CONTEXT:
- Book: "${bookTitle}" (${chapterCount} chapters, ${characterCount} characters)
- Genres: ${genres.join(', ')}
- Current Stage: ${currentStage}
- User Experience: ${userPreferences.experienceLevel}
- Preferred Tone: ${userPreferences.preferredTone}

USER PREFERENCES:
- Writing Style: ${userPreferences.writingStyle}
- Goals: ${userPreferences.goals.join(', ')}
- Communication Style: ${userPreferences.preferredTone}

STORY ELEMENTS:
- Themes: ${storyElements.themes.join(', ')}
- Conflicts: ${storyElements.conflicts.join(', ')}
- Character Arcs: ${storyElements.characterArcs.join(', ')}

STAGE PROGRESS:
- Idea: ${stageProgress.idea.completed ? 'Completed' : 'In Progress'}
- Planning: ${stageProgress.planning.completed ? 'Completed' : 'In Progress'}
- Writing: ${stageProgress.writing.completed ? 'Completed' : 'In Progress'}

USER INTENT: ${intent}
EMOTIONS: ${emotions.join(', ')}
URGENCY: ${urgency}

Provide a helpful, contextual response that:
1. Addresses the user's specific intent
2. Considers their emotional state
3. Provides stage-appropriate guidance
4. Suggests relevant next steps
5. Maintains an encouraging, supportive tone
`;
  }

  // Parse enhanced AI response with additional insights
  private parseEnhancedResponse(responseText: string, intent: string, emotions: string[]): AIResponse {
    // Enhanced parsing with more sophisticated response structure
    const mood = this.determineMood(intent, emotions, responseText);
    
    return {
      message: responseText,
      suggestions: this.extractSuggestions(responseText),
      questions: this.extractQuestions(responseText),
      nextSteps: this.generateNextSteps(intent),
      mood,
      actions: this.generateQuickActions(intent),
      stageGuidance: this.generateStageGuidance(),
      writingInsights: this.generateWritingInsights(intent)
    };
  }

  // Determine mood based on intent, emotions, and response content
  private determineMood(
    intent: string, 
    emotions: string[], 
    responseText: string
  ): 'encouraging' | 'analytical' | 'creative' | 'supportive' | 'celebratory' {
    const lowerResponse = responseText.toLowerCase();
    
    // Check for celebratory content
    if (lowerResponse.includes('congratulations') || lowerResponse.includes('amazing') || 
        lowerResponse.includes('fantastic') || lowerResponse.includes('excellent')) {
      return 'celebratory';
    }
    
    // Check for analytical content
    if (lowerResponse.includes('let\'s analyze') || lowerResponse.includes('consider') || 
        lowerResponse.includes('examine') || lowerResponse.includes('break down')) {
      return 'analytical';
    }
    
    // Check for creative content
    if (lowerResponse.includes('imagine') || lowerResponse.includes('what if') || 
        lowerResponse.includes('creative') || lowerResponse.includes('brainstorm')) {
      return 'creative';
    }
    
    // Check for supportive content
    if (emotions.includes('frustrated') || emotions.includes('overwhelmed') || 
        lowerResponse.includes('it\'s okay') || lowerResponse.includes('don\'t worry')) {
      return 'supportive';
    }
    
    return 'encouraging';
  }

  // Generate stage-specific guidance
  private generateStageGuidance() {
    const { currentStage } = this.context;
    const { stageProgress } = this.memory;
    
    const stageInfo = {
      idea: { next: 'planning', progress: 20, tips: ['Focus on your core concept', 'Explore different angles', 'Consider your target audience'] },
      planning: { next: 'writing', progress: 40, tips: ['Develop your main characters', 'Create a basic plot outline', 'Define your setting'] },
      writing: { next: 'revision', progress: 70, tips: ['Write regularly', 'Don\'t worry about perfection', 'Keep your characters consistent'] },
      revision: { next: 'publishing', progress: 90, tips: ['Read your work aloud', 'Check for consistency', 'Get feedback from others'] },
      publishing: { next: 'complete', progress: 100, tips: ['Format your manuscript', 'Create a compelling cover', 'Plan your marketing'] }
    };
    
    const current = stageInfo[currentStage as keyof typeof stageInfo];
    
    return {
      currentStage,
      nextStage: current.next,
      progress: current.progress,
      tips: current.tips
    };
  }

  // Generate writing insights based on current context
  private generateWritingInsights(intent: string) {
    const insights: any = {};
    
    if (intent === 'writing_analysis') {
      insights.styleAnalysis = 'Consider varying your sentence structure for better flow.';
      insights.pacingNotes = 'Your story has good pacing with a mix of action and reflection.';
      insights.characterDevelopment = 'Your characters are developing well with clear motivations.';
      insights.plotConsistency = 'The plot maintains good consistency throughout.';
    }
    
    return insights;
  }

  // Extract suggestions from response text
  private extractSuggestions(responseText: string): string[] {
    const suggestions: string[] = [];
    const lines = responseText.split('\n');
    
    for (const line of lines) {
      if (line.includes('•') || line.includes('-') || line.includes('*')) {
        const suggestion = line.replace(/^[•\-*]\s*/, '').trim();
        if (suggestion) suggestions.push(suggestion);
      }
    }
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  // Extract questions from response text
  private extractQuestions(responseText: string): string[] {
    const questions: string[] = [];
    const lines = responseText.split('\n');
    
    for (const line of lines) {
      if (line.includes('?') && line.trim().length > 10) {
        questions.push(line.trim());
      }
    }
    
    return questions.slice(0, 2); // Limit to 2 questions
  }

  // Generate fallback response when AI is unavailable
  private generateFallbackResponse(intent: string, emotions: string[]): AIResponse {
    const fallbackResponses = {
      story_help: "I'd love to help you with your story! Could you tell me more about what you're working on?",
      character_help: "Characters are the heart of any story. What kind of character are you developing?",
      writing_advice: "Writing is a journey, and every writer has their own process. What specific aspect would you like to improve?",
      brainstorming: "Let's get creative! What's the seed of your story idea?",
      revision_help: "Revision is where the magic happens. What part of your writing would you like to polish?",
      publishing_help: "Getting your book ready for readers is exciting! What publishing questions do you have?",
      encouragement: "Every writer faces challenges. You're not alone, and your story is worth telling. What's on your mind?",
      progress_check: "Let's celebrate your progress! What have you accomplished recently?",
      general_question: "I'm here to help with your writing journey. What would you like to know?"
    };

    const message = fallbackResponses[intent as keyof typeof fallbackResponses] || 
                   fallbackResponses.general_question;

    return {
      message,
      mood: emotions.includes('frustrated') || emotions.includes('overwhelmed') ? 'supportive' : 'encouraging',
      nextSteps: this.generateNextSteps(intent),
      actions: this.generateQuickActions(intent)
    };
  }

  // Generate next steps based on intent and current stage
  private generateNextSteps(intent: string): string[] {
    const { currentStage } = this.context;
    
    const stageNextSteps = {
      idea: ['Develop your main concept', 'Research your genre', 'Create a basic outline'],
      planning: ['Develop your characters', 'Create a detailed plot', 'Define your setting'],
      writing: ['Set a daily writing goal', 'Focus on one chapter at a time', 'Don\'t worry about perfection'],
      revision: ['Read your work aloud', 'Check for consistency', 'Get feedback from others'],
      publishing: ['Format your manuscript', 'Create a book cover', 'Plan your marketing']
    };

    const intentNextSteps = {
      story_help: ['Break down your story into key scenes', 'Identify your main conflict', 'Develop your story arc'],
      character_help: ['Create character profiles', 'Develop character relationships', 'Plan character arcs'],
      writing_advice: ['Set aside dedicated writing time', 'Read widely in your genre', 'Practice daily writing'],
      brainstorming: ['Use mind mapping techniques', 'Explore different scenarios', 'Consider multiple perspectives'],
      revision_help: ['Take a break before revising', 'Read your work aloud', 'Focus on one aspect at a time']
    };

    const steps = [
      ...(stageNextSteps[currentStage as keyof typeof stageNextSteps] || []),
      ...(intentNextSteps[intent as keyof typeof intentNextSteps] || [])
    ];

    return steps.slice(0, 3); // Return top 3 next steps
  }

  // Generate quick actions based on intent
  private generateQuickActions(intent: string): string[] {
    const actions = {
      story_help: ['Generate plot ideas', 'Create story outline', 'Develop story structure'],
      character_help: ['Generate character ideas', 'Create character profiles', 'Develop character relationships'],
      writing_advice: ['Get writing tips', 'Analyze writing style', 'Improve writing technique'],
      brainstorming: ['Generate story ideas', 'Explore different concepts', 'Create mind maps'],
      revision_help: ['Analyze writing', 'Get revision suggestions', 'Check for consistency'],
      publishing_help: ['Format manuscript', 'Create book cover', 'Plan marketing strategy'],
      encouragement: ['Show writing progress', 'Celebrate achievements', 'Set new goals'],
      progress_check: ['View writing stats', 'Track progress', 'Set new milestones']
    };

    return actions[intent as keyof typeof actions] || ['Get writing help', 'Generate ideas', 'Track progress'];
  }

  // Main method to process user input
  async processInput(input: string): Promise<AIResponse> {
    // Analyze input
    const analysis = this.analyzeIntent(input);
    
    // Update user preferences based on input
    this.updateUserPreferences(input, analysis.entities);
    
    // Generate response
    const response = await this.generateContextualResponse(
      input,
      analysis.intent,
      analysis.entities,
      analysis.emotions,
      analysis.urgency
    );
    
    // Add to memory
    this.addToMemory('user', input, { intent: analysis.intent, emotions: analysis.emotions });
    this.addToMemory('assistant', response.message, { mood: response.mood });
    
    return response;
  }

  // Update user preferences based on conversation
  private updateUserPreferences(input: string, entities: string[]) {
    // Update preferred genres
    const genreKeywords = ['fantasy', 'romance', 'mystery', 'sci-fi', 'thriller', 'historical', 'contemporary'];
    const mentionedGenres = genreKeywords.filter(genre => input.toLowerCase().includes(genre));
    if (mentionedGenres.length > 0) {
      this.memory.userPreferences.preferredGenres = Array.from(
        new Set([...this.memory.userPreferences.preferredGenres, ...mentionedGenres])
      );
    }

    // Update writing style preferences
    const styleKeywords = ['descriptive', 'concise', 'poetic', 'conversational', 'formal'];
    const mentionedStyles = styleKeywords.filter(style => input.toLowerCase().includes(style));
    if (mentionedStyles.length > 0) {
      this.memory.userPreferences.writingStyle = mentionedStyles[0];
    }

    // Update experience level based on language used
    const advancedKeywords = ['pacing', 'character arc', 'plot structure', 'narrative voice'];
    const beginnerKeywords = ['how to', 'what is', 'explain', 'help me understand'];
    
    if (advancedKeywords.some(keyword => input.toLowerCase().includes(keyword))) {
      this.memory.userPreferences.experienceLevel = 'advanced';
    } else if (beginnerKeywords.some(keyword => input.toLowerCase().includes(keyword))) {
      this.memory.userPreferences.experienceLevel = 'beginner';
    }

    this.saveMemory();
  }

  // Get conversation memory
  getMemory(): ConversationMemory {
    return this.memory;
  }

  // Clear conversation memory
  clearMemory() {
    this.memory = {
      messages: [],
      userPreferences: {
        writingStyle: '',
        preferredGenres: [],
        experienceLevel: 'beginner',
        goals: [],
        preferredTone: 'encouraging',
        writingSpeed: 'moderate'
      },
      storyElements: {
        themes: [],
        conflicts: [],
        characterArcs: [],
        plotPoints: [],
        settings: [],
        tone: ''
      },
      writingStats: {
        totalWords: 0,
        averageWordsPerSession: 0,
        longestSession: 0,
        favoriteWritingTime: '',
        commonChallenges: []
      },
      stageProgress: {
        idea: { completed: false, insights: [] },
        planning: { completed: false, insights: [] },
        writing: { completed: false, insights: [] },
        revision: { completed: false, insights: [] },
        publishing: { completed: false, insights: [] }
      }
    };
    this.saveMemory();
  }

  // Get AI personality
  getPersonality(): {
    name: string;
    traits: string[];
    expertise: string[];
    communicationStyle: string;
  } {
    return this.personality;
  }

  // Update writing statistics
  updateWritingStats(wordsWritten: number, sessionDuration: number) {
    this.memory.writingStats.totalWords += wordsWritten;
    this.memory.writingStats.averageWordsPerSession = 
      (this.memory.writingStats.averageWordsPerSession + wordsWritten) / 2;
    
    if (sessionDuration > this.memory.writingStats.longestSession) {
      this.memory.writingStats.longestSession = sessionDuration;
    }
    
    this.saveMemory();
  }

  // Get writing insights
  getWritingInsights() {
    return {
      totalWords: this.memory.writingStats.totalWords,
      averageWordsPerSession: this.memory.writingStats.averageWordsPerSession,
      longestSession: this.memory.writingStats.longestSession,
      stageProgress: this.memory.stageProgress,
      userPreferences: this.memory.userPreferences
    };
  }
}

export const aiBrain = new AIBrain(); 