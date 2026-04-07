// Human Writing Engine - Makes AI writing feel authentically human
// This system ensures writing feels like it came directly from mind to paper

export interface HumanWritingStyle {
  voice:
    | 'conversational'
    | 'literary'
    | 'journalistic'
    | 'poetic'
    | 'stream-of-consciousness';
  pacing: 'slow' | 'moderate' | 'fast' | 'varied';
  complexity: 'simple' | 'moderate' | 'complex';
  emotionalTone: 'neutral' | 'warm' | 'distant' | 'intimate' | 'dramatic';
  sentenceVariety: 'uniform' | 'varied' | 'experimental';
  vocabularyLevel: 'everyday' | 'educated' | 'sophisticated' | 'mixed';
}

export interface HumanWritingPatterns {
  naturalPauses: boolean;
  incompleteThoughts: boolean;
  emotionalShifts: boolean;
  personalTouches: boolean;
  realisticDialogue: boolean;
  sensoryDetails: boolean;
  internalMonologue: boolean;
  memoryFlows: boolean;
}

export interface WritingContext {
  characterVoice?: string;
  emotionalState?: string;
  writingMood?: string;
  previousContent?: string;
  storyTone?: string;
  genre?: string;
  targetAudience?: string;
}

class HumanWritingEngine {
  private style: HumanWritingStyle;
  private patterns: HumanWritingPatterns;
  private context: WritingContext;

  constructor() {
    this.style = {
      voice: 'conversational',
      pacing: 'moderate',
      complexity: 'moderate',
      emotionalTone: 'warm',
      sentenceVariety: 'varied',
      vocabularyLevel: 'mixed',
    };

    this.patterns = {
      naturalPauses: true,
      incompleteThoughts: true,
      emotionalShifts: true,
      personalTouches: true,
      realisticDialogue: true,
      sensoryDetails: true,
      internalMonologue: true,
      memoryFlows: true,
    };

    this.context = {};
  }

  // Initialize with character and story context
  initializeContext(context: WritingContext) {
    this.context = { ...this.context, ...context };
    this.adaptStyleToContext();
  }

  // Adapt writing style based on context
  private adaptStyleToContext() {
    if (this.context.characterVoice) {
      this.style.voice = this.getCharacterVoiceStyle(
        this.context.characterVoice
      );
    }

    if (this.context.emotionalState) {
      this.style.emotionalTone = this.getEmotionalTone(
        this.context.emotionalState
      );
    }

    if (this.context.genre) {
      this.adaptToGenre(this.context.genre);
    }
  }

  // Get character-specific voice style
  private getCharacterVoiceStyle(
    characterType: string
  ): HumanWritingStyle['voice'] {
    const voiceMap: Record<string, HumanWritingStyle['voice']> = {
      introvert: 'stream-of-consciousness',
      extrovert: 'conversational',
      intellectual: 'literary',
      artist: 'poetic',
      reporter: 'journalistic',
      teenager: 'conversational',
      elder: 'literary',
      child: 'stream-of-consciousness',
    };
    return voiceMap[characterType] || 'conversational';
  }

  // Get emotional tone based on character state
  private getEmotionalTone(
    emotion: string
  ): HumanWritingStyle['emotionalTone'] {
    const toneMap: Record<string, HumanWritingStyle['emotionalTone']> = {
      happy: 'warm',
      sad: 'distant',
      angry: 'dramatic',
      anxious: 'intimate',
      excited: 'warm',
      melancholy: 'distant',
      passionate: 'dramatic',
      reflective: 'intimate',
    };
    return toneMap[emotion] || 'neutral';
  }

  // Adapt style to genre
  private adaptToGenre(genre: string) {
    switch (genre.toLowerCase()) {
      case 'romance':
        this.style.emotionalTone = 'warm';
        this.style.complexity = 'moderate';
        this.patterns.sensoryDetails = true;
        break;
      case 'thriller':
        this.style.pacing = 'fast';
        this.style.emotionalTone = 'dramatic';
        this.patterns.emotionalShifts = true;
        break;
      case 'literary':
        this.style.voice = 'literary';
        this.style.complexity = 'complex';
        this.style.vocabularyLevel = 'sophisticated';
        break;
      case 'young-adult':
        this.style.voice = 'conversational';
        this.style.complexity = 'moderate';
        this.style.vocabularyLevel = 'educated';
        break;
      case 'fantasy':
        this.style.voice = 'literary';
        this.style.complexity = 'complex';
        this.patterns.sensoryDetails = true;
        break;
    }
  }

  // Add human-like imperfections and natural flow
  private addHumanTouches(text: string): string {
    let enhancedText = text;

    // Add natural pauses and breaks
    if (this.patterns.naturalPauses) {
      enhancedText = this.addNaturalPauses(enhancedText);
    }

    // Add incomplete thoughts
    if (this.patterns.incompleteThoughts) {
      enhancedText = this.addIncompleteThoughts(enhancedText);
    }

    // Add emotional shifts
    if (this.patterns.emotionalShifts) {
      enhancedText = this.addEmotionalShifts(enhancedText);
    }

    // Add personal touches
    if (this.patterns.personalTouches) {
      enhancedText = this.addPersonalTouches(enhancedText);
    }

    // Add sensory details
    if (this.patterns.sensoryDetails) {
      enhancedText = this.addSensoryDetails(enhancedText);
    }

    // Add internal monologue
    if (this.patterns.internalMonologue) {
      enhancedText = this.addInternalMonologue(enhancedText);
    }

    return enhancedText;
  }

  // Add natural pauses and breathing room
  private addNaturalPauses(text: string): string {
    // Add strategic pauses for natural flow
    return text.replace(/([.!?])\s+/g, (match, punctuation) => {
      const random = Math.random();
      if (random < 0.1) return `${punctuation}\n\n`;
      if (random < 0.2) return `${punctuation}... `;
      return match;
    });
  }

  // Add incomplete thoughts and stream-of-consciousness
  private addIncompleteThoughts(text: string): string {
    const incompletePatterns = [
      'But then again...',
      'Or maybe...',
      'I suppose...',
      'Come to think of it...',
      'Actually...',
      'Well...',
    ];

    // Occasionally add incomplete thoughts
    if (Math.random() < 0.15) {
      const pattern =
        incompletePatterns[
          Math.floor(Math.random() * incompletePatterns.length)
        ];
      return `${pattern} ${text}`;
    }

    return text;
  }

  // Add emotional shifts and mood changes
  private addEmotionalShifts(text: string): string {
    const emotionalTransitions = [
      'Suddenly,',
      'Without warning,',
      'In an instant,',
      'Just like that,',
      'All at once,',
      'Before I knew it,',
    ];

    // Add emotional transitions occasionally
    if (Math.random() < 0.1) {
      const transition =
        emotionalTransitions[
          Math.floor(Math.random() * emotionalTransitions.length)
        ];
      return `${transition} ${text}`;
    }

    return text;
  }

  // Add personal touches and unique voice
  private addPersonalTouches(text: string): string {
    const personalExpressions = [
      'you know',
      'I mean',
      'sort of',
      'kind of',
      'really',
      'actually',
      'basically',
      'literally',
    ];

    // Add personal expressions naturally
    return text.replace(/(\w+\.\s+)/g, match => {
      if (Math.random() < 0.05) {
        const expression =
          personalExpressions[
            Math.floor(Math.random() * personalExpressions.length)
          ];
        return `${expression}, ${match}`;
      }
      return match;
    });
  }

  // Add sensory details for vividness
  private addSensoryDetails(text: string): string {
    const sensoryDetails = [
      'The air felt thick with anticipation.',
      'A faint scent lingered in the room.',
      'The sound echoed in the silence.',
      'The texture was rough against my fingertips.',
      'The taste lingered on my tongue.',
      'The light danced across the surface.',
      'The temperature seemed to shift.',
      'The atmosphere grew heavy.',
    ];

    // Add sensory details occasionally
    if (Math.random() < 0.08) {
      const detail =
        sensoryDetails[Math.floor(Math.random() * sensoryDetails.length)];
      return `${text} ${detail}`;
    }

    return text;
  }

  // Add internal monologue and thoughts
  private addInternalMonologue(text: string): string {
    const thoughtPatterns = [
      'I wondered if...',
      'The thought crossed my mind that...',
      "I couldn't help thinking...",
      'It occurred to me that...',
      'I realized...',
      'I felt...',
      'I knew...',
      'I hoped...',
    ];

    // Add internal thoughts occasionally
    if (Math.random() < 0.12) {
      const thought =
        thoughtPatterns[Math.floor(Math.random() * thoughtPatterns.length)];
      return `${text} ${thought}`;
    }

    return text;
  }

  // Vary sentence structure for natural flow
  private varySentenceStructure(text: string): string {
    const sentences = text.split('. ');
    const variedSentences = sentences.map((sentence, index) => {
      // Vary sentence length and structure
      if (index % 3 === 0 && sentence.length > 50) {
        // Break long sentences occasionally
        const words = sentence.split(' ');
        const midPoint = Math.floor(words.length / 2);
        return `${words.slice(0, midPoint).join(' ')}. ${words.slice(midPoint).join(' ')}`;
      }
      return sentence;
    });

    return variedSentences.join('. ');
  }

  // Add realistic dialogue patterns
  private addRealisticDialogue(text: string): string {
    if (text.includes('"') || text.includes('said') || text.includes('asked')) {
      // Add natural dialogue patterns
      const dialoguePatterns = [
        'she said, her voice barely above a whisper.',
        'he asked, his eyes searching mine.',
        'they replied, the words hanging in the air.',
        'I whispered, the truth finally out.',
        'she murmured, almost to herself.',
        'he muttered under his breath.',
        'they sighed, the weight of it all.',
        'I stammered, trying to find the right words.',
      ];

      return text.replace(/(".*?")/g, match => {
        if (Math.random() < 0.3) {
          const pattern =
            dialoguePatterns[
              Math.floor(Math.random() * dialoguePatterns.length)
            ];
          return `${match} ${pattern}`;
        }
        return match;
      });
    }

    return text;
  }

  // Main method to humanize AI-generated text
  humanizeText(aiText: string, context?: WritingContext): string {
    if (context) {
      this.initializeContext(context);
    }

    let humanizedText = aiText;

    // Apply human writing patterns
    humanizedText = this.addHumanTouches(humanizedText);
    humanizedText = this.varySentenceStructure(humanizedText);
    humanizedText = this.addRealisticDialogue(humanizedText);

    // Add character-specific voice
    humanizedText = this.applyCharacterVoice(humanizedText);

    // Add emotional depth
    humanizedText = this.addEmotionalDepth(humanizedText);

    // Add memory and reflection
    humanizedText = this.addMemoryFlows(humanizedText);

    return humanizedText;
  }

  // Apply character-specific voice patterns
  private applyCharacterVoice(text: string): string {
    switch (this.style.voice) {
      case 'stream-of-consciousness':
        return this.applyStreamOfConsciousness(text);
      case 'conversational':
        return this.applyConversationalVoice(text);
      case 'literary':
        return this.applyLiteraryVoice(text);
      case 'poetic':
        return this.applyPoeticVoice(text);
      default:
        return text;
    }
  }

  // Apply stream-of-consciousness style
  private applyStreamOfConsciousness(text: string): string {
    const streamPatterns = [
      'And then...',
      'But wait...',
      'Or was it...',
      'I remember...',
      "It's like...",
      'You see...',
      'The thing is...',
      'I mean...',
    ];

    // Add stream-of-consciousness elements
    if (Math.random() < 0.2) {
      const pattern =
        streamPatterns[Math.floor(Math.random() * streamPatterns.length)];
      return `${pattern} ${text}`;
    }

    return text;
  }

  // Apply conversational voice
  private applyConversationalVoice(text: string): string {
    const conversationalElements = [
      'you know what I mean?',
      'right?',
      'I guess.',
      'sort of.',
      'kind of.',
      'actually.',
      'really.',
      'basically.',
    ];

    // Add conversational elements
    if (Math.random() < 0.15) {
      const element =
        conversationalElements[
          Math.floor(Math.random() * conversationalElements.length)
        ];
      return `${text} ${element}`;
    }

    return text;
  }

  // Apply literary voice
  private applyLiteraryVoice(text: string): string {
    const literaryElements = [
      'The truth of the matter was...',
      'In retrospect...',
      'As it turned out...',
      'The reality of the situation...',
      'What became clear...',
      'The essence of it all...',
      'The heart of the matter...',
      'The crux of the issue...',
    ];

    // Add literary elements
    if (Math.random() < 0.1) {
      const element =
        literaryElements[Math.floor(Math.random() * literaryElements.length)];
      return `${element} ${text}`;
    }

    return text;
  }

  // Apply poetic voice
  private applyPoeticVoice(text: string): string {
    const poeticElements = [
      'like a whisper in the wind',
      'as gentle as morning light',
      'like shadows dancing on walls',
      'as deep as the ocean',
      'like stars in the night sky',
      'as soft as falling snow',
      'like music in the air',
      'as bright as summer days',
    ];

    // Add poetic elements
    if (Math.random() < 0.12) {
      const element =
        poeticElements[Math.floor(Math.random() * poeticElements.length)];
      return `${text}, ${element}`;
    }

    return text;
  }

  // Add emotional depth and vulnerability
  private addEmotionalDepth(text: string): string {
    const emotionalElements = [
      'I felt it in my bones.',
      'The emotion was raw and real.',
      'It hit me like a wave.',
      'The feeling was overwhelming.',
      "I couldn't shake it.",
      'It lingered in my mind.',
      'The impact was immediate.',
      'I was caught off guard.',
    ];

    // Add emotional depth
    if (Math.random() < 0.08) {
      const element =
        emotionalElements[Math.floor(Math.random() * emotionalElements.length)];
      return `${text} ${element}`;
    }

    return text;
  }

  // Add memory flows and reflection
  private addMemoryFlows(text: string): string {
    if (!this.patterns.memoryFlows) return text;

    const memoryPatterns = [
      'It reminded me of...',
      'I thought back to...',
      'The memory surfaced...',
      'I recalled...',
      'It brought to mind...',
      'I remembered...',
      'The past came flooding back...',
      'I found myself thinking of...',
    ];

    // Add memory flows occasionally
    if (Math.random() < 0.06) {
      const pattern =
        memoryPatterns[Math.floor(Math.random() * memoryPatterns.length)];
      return `${text} ${pattern}`;
    }

    return text;
  }

  // Get writing style summary for AI prompts
  getStylePrompt(): string {
    return `Write in a ${this.style.voice} voice with ${this.style.pacing} pacing and ${this.style.emotionalTone} emotional tone. 
    Use ${this.style.complexity} complexity and ${this.style.vocabularyLevel} vocabulary. 
    Include natural pauses, emotional shifts, personal touches, sensory details, and internal monologue. 
    Make it feel like it came directly from a human mind to paper, with authentic voice and natural flow.`;
  }

  // Update patterns based on user preferences
  updatePatterns(patterns: Partial<HumanWritingPatterns>) {
    this.patterns = { ...this.patterns, ...patterns };
  }

  // Update style based on user preferences
  updateStyle(style: Partial<HumanWritingStyle>) {
    this.style = { ...this.style, ...style };
  }
}

export const humanWritingEngine = new HumanWritingEngine();
