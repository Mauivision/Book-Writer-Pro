const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Book configurations
const BOOKS = [
  {
    name: 'Remembrance of the Moon',
    directory: 'Book/Rememberance of the Moon',
    author: 'Aaron Writer',
    series: 'The Heartline Chronicles - Book 1',
    outputName: 'Remembrance_of_the_Moon_Print_Ready.pdf'
  },
  {
    name: 'The Guardians Choice',
    directory: 'Book/The Guardians Choice',
    author: 'Aaron Writer',
    series: 'The Heartline Chronicles - Book 2',
    outputName: 'The_Guardians_Choice_Print_Ready.pdf'
  },
  {
    name: 'The Evolution',
    directory: 'Book/The Evolution',
    author: 'Aaron Writer',
    series: 'The Heartline Chronicles - Book 3',
    outputName: 'The_Evolution_Print_Ready.pdf'
  }
];

console.log('🚀 Starting batch PDF generation...\n');

BOOKS.forEach((book, index) => {
  console.log(`\n📖 [${index + 1}/${BOOKS.length}] Processing: ${book.name}`);
  console.log(`   Directory: ${book.directory}`);
  
  try {
    // Check if directory exists
    const bookDir = path.join(__dirname, '..', book.directory);
    if (!fs.existsSync(bookDir)) {
      console.log(`   ⚠️  Directory not found, skipping...`);
      return;
    }
    
    // Check for chapter files
    const files = fs.readdirSync(bookDir).filter(f => 
      (f.startsWith('chapter-') || f.startsWith('Chapter-')) && f.endsWith('.md')
    );
    
    if (files.length === 0) {
      console.log(`   ⚠️  No chapter files found, skipping...`);
      return;
    }
    
    console.log(`   ✅ Found ${files.length} chapters`);
    
    // Modify the script to use this book's config
    const scriptContent = fs.readFileSync(path.join(__dirname, 'generate-print-pdf.js'), 'utf-8');
    
    // Create a temporary script for this book
    const tempScript = scriptContent
      .replace(
        /const BOOK_METADATA = \{[\s\S]*?\};/,
        `const BOOK_METADATA = {
  title: '${book.name}',
  author: '${book.author}',
  series: '${book.series}',
  copyrightYear: new Date().getFullYear(),
  publisher: 'Self-Published',
  isbn: ''
};`
      )
      .replace(
        /const bookDir = path\.join\(__dirname, '\.\.\/Book\/Rememberance of the Moon'\);/,
        `const bookDir = path.join(__dirname, '..', '${book.directory}');`
      )
      .replace(
        /const outputPath = path\.join\(__dirname, '\.\.\/Book\/pdfs for print\/Remembrance_of_the_Moon_Print_Ready\.pdf'\);/,
        `const outputPath = path.join(__dirname, '..', 'Book', 'pdfs for print', '${book.outputName}');`
      );
    
    const tempScriptPath = path.join(__dirname, `temp-${index}.js`);
    fs.writeFileSync(tempScriptPath, tempScript);
    
    // Run the script
    execSync(`node "${tempScriptPath}"`, { stdio: 'inherit' });
    
    // Clean up
    fs.unlinkSync(tempScriptPath);
    
    console.log(`   ✨ Completed: ${book.name}`);
    
  } catch (error) {
    console.error(`   ❌ Error processing ${book.name}:`, error.message);
  }
});

console.log('\n\n🎉 Batch PDF generation complete!');
console.log('📁 All PDFs saved to: Book/pdfs for print/');

