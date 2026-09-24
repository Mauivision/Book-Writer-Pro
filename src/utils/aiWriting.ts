import { generateCompletion } from '@/utils/aiProvider';

export interface BookConfig {
  title: string;
  genre: string;
  characters: string[];
  setting: string;
  plotPoints: string[];
}

export interface GeneratedChapter {
  title: string;
  content: string;
  wordCount: number;
}

export const genreConfigs: Record<
  string,
  { setting: string; characters: string[]; plotPoints: string[] }
> = {
  'Science Fiction': {
    setting: 'a futuristic space station in 2156',
    characters: ['a skilled pilot', 'an AI researcher', 'a mysterious alien'],
    plotPoints: [
      'discovering a hidden alien artifact',
      'navigating through a dangerous asteroid field',
      'uncovering a conspiracy that threatens the station',
      'forming an alliance with unexpected allies',
    ],
  },
  Fantasy: {
    setting: 'the mystical realm of Eldoria',
    characters: ['a young mage', 'a seasoned warrior', 'a wise oracle'],
    plotPoints: [
      'finding an ancient magical artifact',
      'battling dark forces in the Shadowlands',
      'discovering the true power of friendship',
      'restoring balance to the realm',
    ],
  },
  Mystery: {
    setting: 'a small coastal town in Maine',
    characters: ['a retired detective', 'a local librarian', 'a suspicious newcomer'],
    plotPoints: [
      'investigating a mysterious disappearance',
      'uncovering hidden family secrets',
      'following clues that lead to danger',
      'solving the case and revealing the truth',
    ],
  },
  Romance: {
    setting: 'a charming bookstore in Paris',
    characters: ['a struggling writer', 'a successful publisher', 'a wise mentor'],
    plotPoints: [
      'meeting under unexpected circumstances',
      'overcoming personal obstacles',
      'facing a crisis that tests their relationship',
      'finding love and happiness together',
    ],
  },
};

const NOVELIST_SYSTEM_PROMPT =
  'You are a professional novelist helping Aaron Vanderpool write a book for A.C.C. L.L.C. Write vivid, publishable prose. Do not mention that you are an AI.';

export async function generateWritingText(
  userPrompt: string,
  systemPrompt = NOVELIST_SYSTEM_PROMPT
): Promise<string> {
  const text = await generateCompletion(systemPrompt, userPrompt);
  if (!text.trim()) {
    throw new Error('The AI provider returned empty text. Existing chapters were left unchanged.');
  }
  return text;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export async function generateBookChapters(
  config: BookConfig,
  onProgress?: (message: string) => void
): Promise<GeneratedChapter[]> {
  const plotPoints = config.plotPoints.filter((point) => point.trim());
  if (plotPoints.length === 0) {
    throw new Error('Add at least one plot point before generating a book.');
  }

  const chapters: GeneratedChapter[] = [];
  const characterList = config.characters.filter((character) => character.trim()).join(', ');

  onProgress?.('Writing the opening chapter…');
  const intro = await generateWritingText(
    `Write an engaging opening chapter for "${config.title}", a ${config.genre} story set in ${config.setting}.
Introduce ${characterList || 'the main characters'} and hint at ${plotPoints[0]}.
Use vivid details, create atmosphere, and establish the tone. Aim for approximately 500 words.
Return only the chapter prose.`
  );
  chapters.push({
    title: 'Chapter 1: The Beginning',
    content: intro,
    wordCount: wordCount(intro),
  });

  for (let index = 1; index < plotPoints.length - 1; index += 1) {
    const chapterNum = index + 1;
    onProgress?.(`Writing chapter ${chapterNum}…`);
    const content = await generateWritingText(
      `Write chapter ${chapterNum} for "${config.title}", a ${config.genre} story in ${config.setting}.
Focus on ${config.characters[0] || 'the protagonist'} navigating ${plotPoints[index]}.
Include dialogue, action, and character development. Aim for approximately 600 words.
Return only the chapter prose.`
    );
    chapters.push({
      title: `Chapter ${chapterNum}`,
      content,
      wordCount: wordCount(content),
    });
  }

  if (plotPoints.length > 1) {
    onProgress?.('Writing the final chapter…');
    const finale = await generateWritingText(
      `Write the final chapter for "${config.title}", a ${config.genre} story in ${config.setting}.
Resolve ${plotPoints[plotPoints.length - 1]} with ${characterList || 'the main characters'}.
Provide a satisfying conclusion. Aim for approximately 700 words.
Return only the chapter prose.`
    );
    chapters.push({
      title: `Chapter ${plotPoints.length}: The End`,
      content: finale,
      wordCount: wordCount(finale),
    });
  }

  return chapters;
}

export async function rewriteChapterText(
  content: string,
  instructions: string
): Promise<string> {
  if (!content.trim()) {
    throw new Error('There is no chapter text to rewrite.');
  }

  return generateWritingText(
    `Rewrite the following chapter according to these instructions: ${instructions}

ORIGINAL:
${content}

Return only the rewritten chapter.`,
    'You are a careful book editor. Preserve the story while improving the prose. Do not invent a new plot unless asked.'
  );
}

export async function generateStoryOutline(
  title: string,
  genre: string,
  premise: string
): Promise<string> {
  return generateWritingText(
    `Create a clear chapter-by-chapter outline for "${title}", a ${genre} book.
Premise: ${premise || 'Use a compelling original premise.'}
Return a numbered outline with a one-sentence purpose for each chapter.`,
    'You are a story architect. Write practical outlines an author can draft from.'
  );
}

export async function checkContinuity(
  chapters: Array<{ title: string; content: string }>
): Promise<string> {
  const excerpts = chapters
    .map((chapter, index) => `Chapter ${index + 1} (${chapter.title}):\n${chapter.content.slice(0, 1200)}`)
    .join('\n\n');

  return generateWritingText(
    `Review these chapters for continuity problems (timeline, character facts, setting, and unresolved contradictions).
List only real issues. If the draft is consistent, say so.

${excerpts}`,
    'You are a continuity editor. Be specific and concise.'
  );
}
