const fs = require('fs');
const path = require('path');

/**
 * Prepares book chapters for PDF generation
 * Cleans screenplay formatting, removes character name markers, etc.
 */

function cleanScreenplayFormatting(content) {
  // Remove screenplay-style character names in bold
  // **CHARACTER:** (stage direction) "dialogue" -> "Dialogue"
  let cleaned = content
    // Remove character name markers: **CHARACTER:** (direction)
    .replace(/\*\*([A-Z_]+):\*\*\s*\([^)]*\)\s*/g, '')
    // Remove standalone character markers
    .replace(/\*\*([A-Z_]+):\*\*\s*/g, '')
    // Convert remaining bold dialogue markers
    .replace(/\*\*([^:]+):\*\*\s*/g, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  return cleaned;
}

function prepareBookForPDF(bookDir, outputDir) {
  console.log(`📖 Preparing book: ${bookDir}`);
  
  const chaptersDir = path.join(bookDir, 'CHAPTERS');
  if (!fs.existsSync(chaptersDir)) {
    console.error(`❌ Chapters directory not found: ${chaptersDir}`);
    return false;
  }
  
  // Find all chapter files
  const files = fs.readdirSync(chaptersDir).filter(f => 
    (f.startsWith('Chapter-') || f.startsWith('chapter-') || f.startsWith('Epilogue-') || f.startsWith('epilogue-')) && 
    f.endsWith('.md')
  );
  
  // Sort by chapter number
  files.sort((a, b) => {
    const numA = parseInt(a.match(/(?:Chapter|chapter)-(\d+)/i)?.[1] || '0');
    const numB = parseInt(b.match(/(?:Chapter|chapter)-(\d+)/i)?.[1] || '0');
    if (numA !== numB) return numA - numB;
    // Epilogue comes last
    if (a.toLowerCase().includes('epilogue')) return 1;
    if (b.toLowerCase().includes('epilogue')) return -1;
    return a.localeCompare(b);
  });
  
  // Count regular chapters (excluding epilogue)
  const regularChapters = files.filter(f => !f.toLowerCase().includes('epilogue'));
  const epilogueNumber = regularChapters.length + 1;
  
  console.log(`📚 Found ${files.length} chapters`);
  
  // Create prepared directory
  const preparedDir = path.join(outputDir, 'prepared');
  if (!fs.existsSync(preparedDir)) {
    fs.mkdirSync(preparedDir, { recursive: true });
  }
  
  let preparedCount = 0;
  const chapterInfo = [];
  
  files.forEach((file, index) => {
    const filePath = path.join(chaptersDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract chapter number and title
    const chapterMatch = file.match(/(?:Chapter|chapter)-(\d+)-(.+?)\.md/i);
    const epilogueMatch = file.match(/Epilogue-(.+?)\.md/i);
    
    let chapterNum, title;
    if (epilogueMatch) {
      chapterNum = epilogueNumber; // Epilogue gets number after last chapter
      title = epilogueMatch[1].replace(/-/g, ' ');
    } else if (chapterMatch) {
      chapterNum = parseInt(chapterMatch[1]);
      title = chapterMatch[2].replace(/-/g, ' ');
    } else {
      chapterNum = index + 1;
      title = file.replace(/\.md$/, '').replace(/(?:Chapter|chapter)-(\d+)-?/i, '');
    }
    
    // Clean content
    const originalLength = content.length;
    content = cleanScreenplayFormatting(content);
    
    // Remove header if it's just the chapter title
    const headerMatch = content.match(/^#+\s*(?:Chapter|chapter)\s*\d+[:\s]*(.+?)(?:\n|$)/i);
    if (headerMatch) {
      content = content.replace(/^#+\s*(?:Chapter|chapter)\s*\d+[:\s]*.*?\n+/i, '');
    }
    
    // Clean up markdown formatting
    content = content
      .replace(/^#+\s*.+\n+/gm, '') // Remove standalone headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic (but keep emphasis in quotes)
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/^[-*+]\s+/gm, '') // Remove list markers
      .replace(/\n{3,}/g, '\n\n') // Normalize newlines
      .trim();
    
    const cleanedLength = content.length;
    const reduction = ((originalLength - cleanedLength) / originalLength * 100).toFixed(1);
    
    // Save cleaned chapter
    const outputFile = `chapter-${chapterNum.toString().padStart(2, '0')}-${file.replace(/^Chapter-|^chapter-|^Epilogue-|^epilogue-/i, '').replace(/\.md$/, '')}.md`;
    const outputPath = path.join(preparedDir, outputFile);
    
    // Add clean chapter header
    let cleanHeader;
    if (epilogueMatch) {
      // Remove "Epilogue:" from title if it's already there
      const cleanTitle = title.replace(/^epilogue:?\s*/i, '');
      cleanHeader = `# Epilogue: ${cleanTitle}\n\n`;
    } else {
      cleanHeader = `# Chapter ${chapterNum}: ${title}\n\n`;
    }
    
    fs.writeFileSync(outputPath, cleanHeader + content);
    
    chapterInfo.push({
      number: chapterNum,
      title,
      original: file,
      prepared: outputFile,
      words: content.split(/\s+/).length,
      reduction: `${reduction}%`
    });
    
    preparedCount++;
    console.log(`   ✅ Prepared: Chapter ${chapterNum} - ${title} (${reduction}% reduction)`);
  });
  
  // Save preparation report
  const report = {
    book: path.basename(bookDir),
    date: new Date().toISOString(),
    totalChapters: preparedCount,
    chapters: chapterInfo.sort((a, b) => a.number - b.number),
    totalWords: chapterInfo.reduce((sum, ch) => sum + ch.words, 0)
  };
  
  fs.writeFileSync(
    path.join(preparedDir, 'preparation-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log(`\n✨ Preparation complete!`);
  console.log(`📊 Total chapters: ${preparedCount}`);
  console.log(`📝 Total words: ${report.totalWords.toLocaleString()}`);
  console.log(`📁 Prepared files: ${preparedDir}`);
  
  return { preparedDir, report };
}

// Main execution
function main() {
  const bookDir = process.argv[2] || 'Book/Shadow Realms Reborn';
  const outputDir = process.argv[3] || 'Book/pdfs for print';
  
  const bookPath = path.join(__dirname, '..', bookDir);
  const outputPath = path.join(__dirname, '..', outputDir);
  
  if (!fs.existsSync(bookPath)) {
    console.error(`❌ Book directory not found: ${bookPath}`);
    process.exit(1);
  }
  
  const result = prepareBookForPDF(bookPath, outputPath);
  
  if (result) {
    console.log(`\n📄 Next step: Generate PDF using prepared chapters`);
    console.log(`   node scripts/generate-book-pdf.js "Book Name" "${result.preparedDir}" "Author" "Series" "output.pdf"`);
  }
}

main();

