const fs = require('fs');
const path = require('path');

/**
 * Exports book chapters as plain text for 11 Labs / ElevenLabs text-to-speech.
 * Strips markdown so you can paste directly into ElevenLabs.
 *
 * Usage: node scripts/export-audio-chapters.js "Book/Soul Engine"
 * Output: <BookDir>/AUDIO_11LABS/chapters/*.txt
 */

function stripMarkdown(content) {
  return content
    .replace(/^#+\s*.+$/gm, '') // Remove headers (leave blank line)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function exportBook(bookDir) {
  const root = path.join(__dirname, '..');
  const fullBookDir = path.join(root, bookDir);
  const chaptersDir = path.join(fullBookDir, 'CHAPTERS');
  const outputDir = path.join(fullBookDir, 'AUDIO_11LABS', 'chapters');

  if (!fs.existsSync(chaptersDir)) {
    console.error('❌ CHAPTERS directory not found:', chaptersDir);
    process.exit(1);
  }

  const files = fs.readdirSync(chaptersDir).filter(f =>
    (f.startsWith('Chapter-') || f.startsWith('chapter-') || f.startsWith('Epilogue-')) && f.endsWith('.md')
  );

  files.sort((a, b) => {
    const numA = parseInt(a.match(/(?:Chapter|chapter)-(\d+)/i)?.[1] ?? '999');
    const numB = parseInt(b.match(/(?:Chapter|chapter)-(\d+)/i)?.[1] ?? '999');
    if (numA !== numB) return numA - numB;
    return a.localeCompare(b);
  });

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('📖 Exporting chapters for 11 Labs audio...');
  console.log('   Source:', chaptersDir);
  console.log('   Output:', outputDir);

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(chaptersDir, file), 'utf-8');
    const plain = stripMarkdown(content);
    const base = file.replace(/\.md$/i, '');
    const outFile = base + '.txt';
    fs.writeFileSync(path.join(outputDir, outFile), plain, 'utf-8');
    console.log('   ✅', outFile);
  });

  console.log('\n✨ Done. Use the .txt files in AUDIO_11LABS/chapters/ with ElevenLabs.');
}

const bookDir = process.argv[2] || 'Book/Soul Engine';
exportBook(bookDir);
