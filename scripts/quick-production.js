#!/usr/bin/env node

/**
 * Quick Production Script
 * Automatically detects books and generates PDFs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BOOK_DIR = path.join(__dirname, '..', 'Book');
const OUTPUT_DIR = path.join(__dirname, '..', 'Book', 'pdfs for print');

// Known book configurations
const KNOWN_BOOKS = [
  {
    name: 'Remembrance of the Moon',
    dir: 'Rememberance of the Moon',
    author: 'Aaron Writer',
    series: 'The Heartline Chronicles - Book 1'
  },
  {
    name: 'The Guardians Choice',
    dir: 'The Guardians Choice',
    subdir: 'CHAPTERS',
    author: 'Aaron Writer',
    series: 'The Heartline Chronicles - Book 2'
  },
  {
    name: 'The Evolution',
    dir: 'The Evolution',
    subdir: 'CHAPTERS',
    author: 'Aaron Writer',
    series: 'The Heartline Chronicles - Book 3'
  },
  {
    name: 'International Hearts',
    dir: 'International Hearts',
    subdir: 'CHAPTERS',
    author: 'Aaron Writer',
    series: 'International Hearts Series'
  }
];

function findBooks() {
  const books = [];
  
  if (!fs.existsSync(BOOK_DIR)) {
    console.error('❌ Book directory not found');
    return books;
  }
  
  const dirs = fs.readdirSync(BOOK_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // Check known books
  KNOWN_BOOKS.forEach(book => {
    const bookPath = path.join(BOOK_DIR, book.dir);
    if (fs.existsSync(bookPath)) {
      const chaptersPath = book.subdir 
        ? path.join(bookPath, book.subdir)
        : bookPath;
      
      if (fs.existsSync(chaptersPath)) {
        const files = fs.readdirSync(chaptersPath).filter(f => 
          (f.startsWith('chapter-') || f.startsWith('Chapter-')) && f.endsWith('.md')
        );
        
        if (files.length > 0) {
          books.push({
            ...book,
            path: chaptersPath,
            chapters: files.length
          });
        }
      }
    }
  });
  
  return books;
}

function generatePDF(book) {
  const outputName = `${book.name.replace(/\s+/g, '_')}_Print_Ready.pdf`;
  const outputPath = path.join(OUTPUT_DIR, outputName);
  
  // Check if already exists and is recent
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    const daysSinceModified = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
    
    if (daysSinceModified < 1) {
      console.log(`   ⏭️  Skipping (recently generated)`);
      return false;
    }
  }
  
  try {
    const relativePath = path.relative(path.join(__dirname, '..'), book.path);
    const command = `node scripts/generate-book-pdf.js "${book.name}" "${relativePath}" "${book.author}" "${book.series}" "${outputName}"`;
    
    console.log(`   📄 Generating PDF...`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('🚀 Quick Production - Auto-detecting books...\n');
  
  const books = findBooks();
  
  if (books.length === 0) {
    console.log('❌ No books found with chapters');
    return;
  }
  
  console.log(`📚 Found ${books.length} book(s):\n`);
  books.forEach((book, i) => {
    console.log(`${i + 1}. ${book.name}`);
    console.log(`   📁 ${book.path}`);
    console.log(`   📖 ${book.chapters} chapters`);
  });
  
  console.log(`\n🔄 Generating PDFs...\n`);
  
  let generated = 0;
  books.forEach((book, i) => {
    console.log(`[${i + 1}/${books.length}] ${book.name}`);
    if (generatePDF(book)) {
      generated++;
    }
    console.log('');
  });
  
  console.log(`\n✨ Production complete!`);
  console.log(`📊 Generated: ${generated}/${books.length} PDFs`);
  
  // Update dashboard
  console.log(`\n📊 Updating dashboard...`);
  try {
    execSync('node scripts/production-dashboard.js', { stdio: 'inherit' });
  } catch (error) {
    console.log('   ⚠️  Dashboard update skipped');
  }
  
  console.log(`\n✅ All done! Check: Book/pdfs for print/`);
}

main();

