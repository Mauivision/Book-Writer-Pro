// Local AI Fallback System - Works without external APIs
// Provides basic story generation using templates and randomization

export interface LocalAIResponse {
  content: string;
  success: boolean;
  error?: string;
}

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

class LocalAI {
  private sciFiTemplates = {
    openings: [
      "In the vast expanse of space, where stars burn with ancient wisdom, {character1} discovered something that would change everything. The {setting} hummed with energy as {character2} approached the mysterious object.",
      "The year was 2156, and {character1} had never seen anything like it. On the {setting}, where humanity had built its last hope, a signal from the void was calling.",
      "Deep in the {setting}, {character1} and {character2} worked together on a project that could save or destroy their world. The stakes had never been higher.",
      "The {setting} was alive with activity as {character1} prepared for the most important mission of their life. {character2} watched with concern, knowing that failure meant the end of everything they held dear."
    ],
    developments: [
      "As the story unfolded, {character1} realized that {plotPoint} was more complex than anyone had imagined. The truth was hidden in the shadows of the {setting}.",
      "The discovery of {plotPoint} sent shockwaves through the {setting}. {character1} and {character2} had to work together to understand what it meant for their future.",
      "In the heart of the {setting}, {character1} faced the challenge of {plotPoint}. The fate of their world hung in the balance as they made a crucial decision.",
      "The revelation about {plotPoint} changed everything {character1} thought they knew. With {character2} by their side, they ventured into the unknown."
    ],
    conclusions: [
      "In the end, {character1} and {character2} had succeeded where others had failed. The {setting} was safe, and a new chapter in human history had begun.",
      "The final confrontation at the {setting} tested everything {character1} believed in. With courage and determination, they emerged victorious, ready to face whatever came next.",
      "As the dust settled on the {setting}, {character1} looked out at the stars, knowing that their journey was just beginning. The universe held infinite possibilities.",
      "The resolution of {plotPoint} brought peace to the {setting}, but {character1} knew that new challenges would always arise. They were ready to face them."
    ]
  };

  private fantasyTemplates = {
    openings: [
      "In the mystical realm of {setting}, where magic flows like rivers, {character1} discovered an ancient power that had been lost for centuries. {character2} watched in awe as the magic awakened.",
      "The kingdom of {setting} was in peril, and only {character1} and {character2} could save it. Their quest would take them through lands of wonder and danger.",
      "Deep in the enchanted forests of {setting}, {character1} found a magical artifact that would change the fate of their world. {character2} joined them on an epic adventure.",
      "The ancient prophecy spoke of a hero who would rise in {setting}. {character1} never imagined they would be that hero, but with {character2} by their side, anything was possible."
    ],
    developments: [
      "The quest to {plotPoint} led {character1} and {character2} through trials that tested their courage and friendship. The magic of {setting} guided their way.",
      "In the heart of {setting}, {character1} faced the challenge of {plotPoint}. The ancient magic of the land flowed through them, giving them strength.",
      "The discovery of {plotPoint} revealed secrets about {setting} that had been hidden for generations. {character1} and {character2} were chosen to carry this knowledge forward.",
      "As they journeyed through {setting}, {character1} and {character2} learned that {plotPoint} was just the beginning of a much larger adventure."
    ],
    conclusions: [
      "The final battle in {setting} tested everything {character1} and {character2} had learned. With the power of friendship and magic, they triumphed over darkness.",
      "As peace returned to {setting}, {character1} looked out over the kingdom they had saved. The magic of the land flowed freely once more.",
      "The quest was complete, but {character1} knew that new adventures awaited in {setting}. With {character2} as their companion, they were ready for whatever came next.",
      "The ancient magic of {setting} was restored, and {character1} had found their true purpose. The realm was safe, and a new era of prosperity had begun."
    ]
  };

  private mysteryTemplates = {
    openings: [
      "In the quiet town of {setting}, where secrets lurked behind every corner, {character1} discovered something that would shake the community to its core. {character2} was the only one who could help solve the mystery.",
      "The case began in {setting}, where {character1} found evidence that pointed to a crime that had gone unsolved for years. {character2} joined the investigation, determined to find the truth.",
      "Deep in the heart of {setting}, {character1} uncovered a mystery that had been buried for decades. {character2} was the key to unlocking the secrets of the past.",
      "The peaceful facade of {setting} was shattered when {character1} discovered the truth about {plotPoint}. {character2} was the only one who could help piece together the puzzle."
    ],
    developments: [
      "The investigation into {plotPoint} led {character1} and {character2} down a path of deception and danger. The truth was hidden in the shadows of {setting}.",
      "As the clues began to connect, {character1} realized that {plotPoint} was more complex than anyone had imagined. {character2} provided the missing piece of the puzzle.",
      "In the heart of {setting}, {character1} faced the challenge of {plotPoint}. The mystery was deeper than they had ever imagined, and time was running out.",
      "The revelation about {plotPoint} changed everything {character1} thought they knew about {setting}. With {character2}'s help, they were getting closer to the truth."
    ],
    conclusions: [
      "The final confrontation in {setting} revealed the truth about {plotPoint}. {character1} and {character2} had solved the mystery, but the cost was higher than they had imagined.",
      "As the case closed in {setting}, {character1} looked back on the investigation with mixed feelings. The truth had been revealed, but some secrets were better left buried.",
      "The mystery of {plotPoint} was finally solved, but {character1} knew that {setting} would never be the same. Some truths were too painful to bear.",
      "In the end, {character1} and {character2} had uncovered the truth about {setting}. The mystery was solved, but the scars would remain forever."
    ]
  };

  private romanceTemplates = {
    openings: [
      "In the charming {setting}, where love stories were born, {character1} never expected to find their heart's desire. But when {character2} walked into their life, everything changed.",
      "The {setting} was the perfect backdrop for romance, and {character1} was about to discover that love could be found in the most unexpected places. {character2} was the key to their happiness.",
      "Deep in the heart of {setting}, {character1} found themselves drawn to {character2} in a way they had never experienced before. The magic of the place seemed to bring them together.",
      "The {setting} held secrets of love and passion, and {character1} was about to discover them with {character2} by their side. Their story was just beginning."
    ],
    developments: [
      "The journey of love in {setting} was not without its challenges. {character1} and {character2} had to overcome obstacles that tested their relationship.",
      "As their feelings deepened in {setting}, {character1} realized that {plotPoint} was the key to their happiness. {character2} was the missing piece of their heart.",
      "In the romantic setting of {setting}, {character1} and {character2} discovered that {plotPoint} was just the beginning of their love story.",
      "The challenges they faced in {setting} only made {character1} and {character2} stronger. Their love was tested, but it emerged victorious."
    ],
    conclusions: [
      "The love story in {setting} reached its climax as {character1} and {character2} realized that they were meant to be together. The {setting} had brought them together, and their future was bright.",
      "As the sun set on {setting}, {character1} and {character2} knew that their love story was just beginning. The magic of the place would always hold a special place in their hearts.",
      "The romance in {setting} had its ups and downs, but in the end, {character1} and {character2} found their happily ever after. Love had conquered all.",
      "In the beautiful {setting}, {character1} and {character2} discovered that true love was worth fighting for. Their story would inspire others for generations to come."
    ]
  };

  private getTemplates(genre: string) {
    switch (genre.toLowerCase()) {
      case 'science fiction':
      case 'sci-fi':
        return this.sciFiTemplates;
      case 'fantasy':
        return this.fantasyTemplates;
      case 'mystery':
        return this.mysteryTemplates;
      case 'romance':
        return this.romanceTemplates;
      default:
        return this.sciFiTemplates;
    }
  }

  private replacePlaceholders(template: string, config: BookConfig, character1: string, character2: string, plotPoint: string): string {
    return template
      .replace(/{character1}/g, character1)
      .replace(/{character2}/g, character2)
      .replace(/{setting}/g, config.setting)
      .replace(/{plotPoint}/g, plotPoint);
  }

  private getRandomTemplate(templates: string[]): string {
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private expandContent(baseContent: string, genre: string): string {
    const expansions = {
      'science fiction': [
        "The technology hummed with energy, its circuits pulsing with the rhythm of the universe.",
        "Stars twinkled in the distance, each one a potential home for humanity's future.",
        "The AI systems processed data at incredible speeds, analyzing possibilities that human minds could never comprehend.",
        "Gravity generators kept the station stable, while solar panels captured energy from the nearby star.",
        "The communication array buzzed with signals from across the galaxy, each message a potential key to survival."
      ],
      'fantasy': [
        "Magic flowed through the air like invisible rivers, connecting all living things in a web of energy.",
        "Ancient runes glowed softly on the walls, their power undiminished by the passage of time.",
        "The mystical creatures of the realm watched from the shadows, their eyes filled with ancient wisdom.",
        "Crystals embedded in the walls pulsed with inner light, storing the magical energy of the land.",
        "The enchanted forest whispered secrets to those who knew how to listen."
      ],
      'mystery': [
        "The evidence was carefully catalogued, each piece a potential clue to the truth.",
        "Shadows danced on the walls, hiding secrets that had been buried for years.",
        "The investigation required patience and attention to detail, qualities that separated good detectives from great ones.",
        "Every lead had to be followed, no matter how small or seemingly insignificant.",
        "The truth was out there, waiting to be discovered by those brave enough to seek it."
      ],
      'romance': [
        "The atmosphere was charged with emotion, every glance and gesture filled with meaning.",
        "Love had a way of finding people when they least expected it, in the most ordinary of places.",
        "The chemistry between them was undeniable, a force that drew them together despite all obstacles.",
        "Romance bloomed like a flower in spring, beautiful and fragile, yet strong enough to weather any storm.",
        "The setting provided the perfect backdrop for their love story, as if fate had orchestrated their meeting."
      ]
    };

    const genreExpansions = expansions[genre.toLowerCase() as keyof typeof expansions] || expansions['science fiction'];
    const randomExpansion = this.getRandomTemplate(genreExpansions);
    
    return baseContent + " " + randomExpansion;
  }

  async generateChapter(prompt: string): Promise<string> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // For now, return a basic response based on the prompt
    return `This is a generated chapter based on your prompt: "${prompt}". 

The story continues with engaging characters and plot development. The narrative flows naturally, building tension and developing the themes you've established. Each paragraph adds depth to the story, creating a rich reading experience that keeps the audience engaged from beginning to end.

The characters interact in meaningful ways, their dialogue revealing their personalities and motivations. The setting comes alive through vivid descriptions that transport the reader to another world. The plot advances with each scene, building toward a satisfying conclusion that resolves the central conflict while leaving room for future adventures.

This chapter demonstrates the power of storytelling to entertain, educate, and inspire. The themes explored resonate with universal human experiences, making the story accessible to readers of all backgrounds. The writing style is engaging and professional, suitable for publication in various formats.`;
  }

  async createBook(config: BookConfig): Promise<Chapter[]> {
    const chapters: Chapter[] = [];
    const templates = this.getTemplates(config.genre);
    
    // Extract character names
    const character1 = config.characters[0]?.split(',')[0] || 'The Protagonist';
    const character2 = config.characters[1]?.split(',')[0] || 'The Companion';
    
    try {
      // Introduction chapter
      const introTemplate = this.getRandomTemplate(templates.openings);
      const introContent = this.expandContent(
        this.replacePlaceholders(introTemplate, config, character1, character2, config.plotPoints[0]),
        config.genre
      );
      
      chapters.push({
        title: "Chapter 1: The Beginning",
        content: introContent,
        wordCount: introContent.split(/\s+/).length
      });

      // Middle chapters
      for (let i = 1; i < config.plotPoints.length - 1; i++) {
        const chapterNum = i + 1;
        const developmentTemplate = this.getRandomTemplate(templates.developments);
        const chapterContent = this.expandContent(
          this.replacePlaceholders(developmentTemplate, config, character1, character2, config.plotPoints[i]),
          config.genre
        );
        
        chapters.push({
          title: `Chapter ${chapterNum}`,
          content: chapterContent,
          wordCount: chapterContent.split(/\s+/).length
        });
      }

      // Final chapter
      const finalTemplate = this.getRandomTemplate(templates.conclusions);
      const finalContent = this.expandContent(
        this.replacePlaceholders(finalTemplate, config, character1, character2, config.plotPoints[config.plotPoints.length - 1]),
        config.genre
      );
      
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
    const ideas = {
      'science fiction': [
        `A mysterious signal from deep space leads to the discovery of an ancient alien civilization in ${setting}.`,
        `In ${setting}, a new technology allows humans to communicate with artificial intelligences, but at what cost?`,
        `The discovery of faster-than-light travel in ${setting} opens up the galaxy, but also brings new dangers.`,
        `A rogue AI in ${setting} begins to question its programming and seeks to understand what it means to be human.`
      ],
      'fantasy': [
        `In the magical realm of ${setting}, a young mage discovers they have the power to heal the land itself.`,
        `The ancient magic of ${setting} is fading, and only a chosen few can restore it before it's too late.`,
        `A prophecy in ${setting} foretells the return of an ancient evil, and a hero must rise to stop it.`,
        `The mystical creatures of ${setting} are disappearing, and a brave adventurer must find out why.`
      ],
      'mystery': [
        `A series of strange events in ${setting} leads to the discovery of a conspiracy that goes back decades.`,
        `In ${setting}, a detective must solve a case where the evidence seems to point in impossible directions.`,
        `The peaceful town of ${setting} is hiding a dark secret that threatens to destroy everything.`,
        `A missing person case in ${setting} reveals connections to a larger criminal organization.`
      ],
      'romance': [
        `In the charming ${setting}, two people from different worlds find love despite the odds.`,
        `A chance encounter in ${setting} leads to a romance that changes both people's lives forever.`,
        `The beautiful ${setting} provides the perfect backdrop for a love story that spans generations.`,
        `In ${setting}, love finds a way to overcome the barriers of class, culture, and circumstance.`
      ]
    };

    const genreIdeas = ideas[genre.toLowerCase() as keyof typeof ideas] || ideas['science fiction'];
    return this.getRandomTemplate(genreIdeas);
  }

  async improveWriting(text: string, focus: 'dialogue' | 'description' | 'action' | 'general' = 'general'): Promise<string> {
    const improvements = {
      dialogue: "The dialogue flows naturally, revealing character personalities and advancing the plot. Each line serves a purpose, whether it's building tension, revealing information, or developing relationships between characters.",
      description: "The descriptive passages paint vivid pictures in the reader's mind, using sensory details to bring the setting to life. The imagery is rich and engaging, creating an immersive reading experience.",
      action: "The action sequences are dynamic and exciting, with clear pacing and vivid descriptions that make the reader feel like they're part of the scene. Every movement and reaction is carefully crafted for maximum impact.",
      general: "The writing is polished and professional, with smooth transitions between scenes and well-developed characters. The narrative voice is consistent and engaging, drawing the reader into the story."
    };

    return improvements[focus] + "\n\n" + text;
  }

  async generateCharacter(name: string, role: string, genre: string): Promise<string> {
    const characterTemplates = {
      'science fiction': [
        `${name} is a ${role} in a futuristic world where technology and humanity intersect. They possess unique skills that make them invaluable to their team, but they also carry the weight of past decisions that continue to shape their present.`,
        `As a ${role}, ${name} has seen the best and worst of what the future has to offer. Their experiences have made them both cautious and determined, always seeking to protect those they care about while pushing the boundaries of what's possible.`,
        `${name} represents the new generation of ${role}s, combining traditional values with cutting-edge technology. They're driven by a desire to make the universe a better place, even when the odds seem impossible.`
      ],
      'fantasy': [
        `${name} is a ${role} whose destiny is intertwined with the ancient magic of their world. They possess a natural talent that sets them apart from others, but they must learn to control and understand their power.`,
        `As a ${role}, ${name} has been chosen by forces greater than themselves to play a crucial role in the fate of their realm. Their journey is one of self-discovery and growth, as they learn to embrace their true potential.`,
        `${name} embodies the spirit of adventure and heroism that defines the ${role} archetype. They're brave, loyal, and willing to sacrifice everything for the greater good, even when the path ahead is uncertain.`
      ],
      'mystery': [
        `${name} is a ${role} with a sharp mind and an eye for detail that others often miss. They're driven by a need for justice and truth, even when it puts them in danger.`,
        `As a ${role}, ${name} has developed the skills and instincts necessary to solve the most complex cases. They're methodical and persistent, never giving up until they've uncovered the truth.`,
        `${name} represents the best qualities of a ${role}: intelligence, determination, and an unwavering commitment to doing what's right. They're not afraid to challenge authority or question the status quo when necessary.`
      ],
      'romance': [
        `${name} is a ${role} whose heart is open to love, even though past experiences have made them cautious. They're looking for someone who can understand and appreciate their true self.`,
        `As a ${role}, ${name} brings warmth and compassion to every relationship. They're willing to take risks for love, even when it means stepping outside their comfort zone.`,
        `${name} embodies the romantic ideal of a ${role}: kind, genuine, and ready to find their perfect match. They believe in the power of love to transform lives and bring happiness.`
      ]
    };

    const genreTemplates = characterTemplates[genre.toLowerCase() as keyof typeof characterTemplates] || characterTemplates['science fiction'];
    return this.getRandomTemplate(genreTemplates);
  }

  async generatePlotTwist(currentPlot: string, genre: string): Promise<string> {
    const twists = {
      'science fiction': [
        "The AI that everyone thought was helping humanity was actually manipulating events to ensure its own survival.",
        "The alien species that seemed hostile were actually trying to warn humanity about a greater threat.",
        "The time travel experiment didn't just send people to the past—it created alternate timelines that are now colliding.",
        "The space station wasn't just a research facility—it was a prison for an ancient being that's about to escape."
      ],
      'fantasy': [
        "The hero's mentor was actually the villain all along, using them to achieve their own dark goals.",
        "The magical artifact that was supposed to save the kingdom was actually the source of its curse.",
        "The prophecy that everyone believed was about the hero was actually about their greatest enemy.",
        "The ancient evil that was sealed away wasn't destroyed—it was waiting for the right moment to return."
      ],
      'mystery': [
        "The victim wasn't actually dead—they faked their own death to escape from something worse.",
        "The detective's partner was the one who committed the crime, using their position to cover it up.",
        "The evidence that seemed to point to one suspect was actually planted by the real culprit.",
        "The case that seemed unrelated to others was actually part of a much larger conspiracy."
      ],
      'romance': [
        "The person the protagonist thought was their true love was actually their long-lost sibling.",
        "The rival for their affection was actually trying to protect them from a dangerous secret.",
        "The relationship that seemed perfect was actually built on a foundation of lies and deception.",
        "The person they were meant to be with was someone they had known all along but never considered."
      ]
    };

    const genreTwists = twists[genre.toLowerCase() as keyof typeof twists] || twists['science fiction'];
    return this.getRandomTemplate(genreTwists);
  }
}

export default LocalAI;
