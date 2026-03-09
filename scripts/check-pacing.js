const fs = require('fs');
const path = require('path');

/**
 * Pacing Analysis Script
 * Checks for:
 * - Paragraphs over 200 words (too dense)
 * - Sentences over 50 words (too long)
 * - Chapters with very few paragraph breaks
 * - Very short chapters that might need expansion
 */

function analyzePacing(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const issues = [];
  let paragraphCount = 0;
  let totalWords = 0;
  let longParagraphs = 0;
  let longSentences = 0;
  
  let currentParagraph = '';
  let currentParagraphWords = 0;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip headers and empty lines
    if (trimmed.startsWith('#') || trimmed === '') {
      if (currentParagraph.trim()) {
        paragraphCount++;
        totalWords += currentParagraphWords;
        
        if (currentParagraphWords > 200) {
          longParagraphs++;
          issues.push({
            type: 'long_paragraph',
            wordCount: currentParagraphWords,
            preview: currentParagraph.substring(0, 100) + '...'
          });
        }
        
        // Check sentences in paragraph
        const sentences = currentParagraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
        for (const sentence of sentences) {
          const words = sentence.trim().split(/\s+/).length;
          if (words > 50) {
            longSentences++;
            issues.push({
              type: 'long_sentence',
              wordCount: words,
              preview: sentence.substring(0, 100) + '...'
            });
          }
        }
        
        currentParagraph = '';
        currentParagraphWords = 0;
      }
      continue;
    }
    
    // Accumulate paragraph
    currentParagraph += ' ' + trimmed;
    currentParagraphWords += trimmed.split(/\s+/).length;
  }
  
  // Handle last paragraph
  if (currentParagraph.trim()) {
    paragraphCount++;
    totalWords += currentParagraphWords;
    
    if (currentParagraphWords > 200) {
      longParagraphs++;
      issues.push({
        type: 'long_paragraph',
        wordCount: currentParagraphWords,
        preview: currentParagraph.substring(0, 100) + '...'
      });
    }
  }
  
  const avgWordsPerParagraph = paragraphCount > 0 ? totalWords / paragraphCount : 0;
  const isVeryShort = totalWords < 500;
  const hasFewParagraphs = paragraphCount < 10 && totalWords > 1000;
  
  return {
    filePath,
    totalWords,
    paragraphCount,
    avgWordsPerParagraph,
    longParagraphs,
    longSentences,
    issues,
    isVeryShort,
    hasFewParagraphs,
    needsAttention: longParagraphs > 0 || longSentences > 0 || hasFewParagraphs
  };
}

function scanBookDirectory(bookDir) {
  const chaptersDir = path.join(bookDir, 'CHAPTERS');
  if (!fs.existsSync(chaptersDir)) {
    return [];
  }
  
  const files = fs.readdirSync(chaptersDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(chaptersDir, f));
  
  const results = [];
  for (const file of files) {
    try {
      const analysis = analyzePacing(file);
      if (analysis.needsAttention || analysis.isVeryShort) {
        results.push(analysis);
      }
    } catch (error) {
      console.error(`Error analyzing ${file}:`, error.message);
    }
  }
  
  return results;
}

// Main execution
const books = [
  'Book/Ascent of the Eternal Spark',
  'Book/International Hearts',
  'Book/Shadow Realms Reborn',
  'Book/The Evolution',
  'Book/The Guardians Choice',
  'Book/Rememberance of the Moon'
];

console.log('📊 Scanning books for pacing issues...\n');

const allIssues = [];
for (const book of books) {
  const bookPath = path.join(__dirname, '..', book);
  if (fs.existsSync(bookPath)) {
    const issues = scanBookDirectory(bookPath);
    if (issues.length > 0) {
      console.log(`\n📚 ${path.basename(book)}:`);
      for (const issue of issues) {
        const filename = path.basename(issue.filePath);
        console.log(`  ⚠️  ${filename}`);
        console.log(`     Words: ${issue.totalWords}, Paragraphs: ${issue.paragraphCount}`);
        if (issue.longParagraphs > 0) {
          console.log(`     ⚠️  ${issue.longParagraphs} long paragraph(s) (>200 words)`);
        }
        if (issue.longSentences > 0) {
          console.log(`     ⚠️  ${issue.longSentences} long sentence(s) (>50 words)`);
        }
        if (issue.hasFewParagraphs) {
          console.log(`     ⚠️  Very few paragraph breaks for length`);
        }
        if (issue.isVeryShort) {
          console.log(`     ⚠️  Very short chapter (<500 words) - may need expansion`);
        }
      }
      allIssues.push(...issues);
    }
  }
}

if (allIssues.length === 0) {
  console.log('\n✅ No major pacing issues found!');
} else {
  console.log(`\n\n📋 Summary: ${allIssues.length} chapter(s) need attention`);
}

