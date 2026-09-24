import { generateBookChapters, generateWritingText } from '@/utils/aiWriting';
import { generateCompletion } from '@/utils/aiProvider';

jest.mock('@/utils/aiProvider', () => ({
  generateCompletion: jest.fn(),
}));

const mockGenerateCompletion = generateCompletion as jest.MockedFunction<typeof generateCompletion>;

describe('AI writing helpers', () => {
  beforeEach(() => {
    mockGenerateCompletion.mockReset();
  });

  it('sends every chapter through generateCompletion', async () => {
    mockGenerateCompletion
      .mockResolvedValueOnce('Opening chapter text')
      .mockResolvedValueOnce('Middle chapter text')
      .mockResolvedValueOnce('Final chapter text');

    const chapters = await generateBookChapters({
      title: 'Test Book',
      genre: 'Fantasy',
      characters: ['A mage'],
      setting: 'Eldoria',
      plotPoints: ['the map', 'the trial', 'the return'],
    });

    expect(chapters).toHaveLength(3);
    expect(mockGenerateCompletion).toHaveBeenCalledTimes(3);
    expect(chapters[0]?.content).toBe('Opening chapter text');
    expect(chapters[2]?.content).toBe('Final chapter text');
  });

  it('does not invent chapters when the provider returns empty text', async () => {
    mockGenerateCompletion.mockResolvedValue('   ');

    await expect(
      generateWritingText('Write a chapter')
    ).rejects.toThrow(/empty text/i);
  });

  it('surfaces provider errors so the UI can keep the old draft', async () => {
    mockGenerateCompletion.mockRejectedValue(new Error('Cannot reach Ollama'));

    await expect(
      generateBookChapters({
        title: 'Test Book',
        genre: 'Fantasy',
        characters: ['A mage'],
        setting: 'Eldoria',
        plotPoints: ['start', 'end'],
      })
    ).rejects.toThrow(/Cannot reach Ollama/);
  });
});
