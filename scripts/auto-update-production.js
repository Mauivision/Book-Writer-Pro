const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Auto-Update Production System
 * Automatically regenerates PDFs when book files are updated
 * Updates story build files and documentation
 */

const BOOK_DIR = path.join(__dirname, '..', 'Book');
const PDF_DIR = path.join(__dirname, '..', 'Book', 'pdfs for print');
const STATUS_FILE = path.join(PDF_DIR, 'production-status.json');

// Book configurations with their source directories
const BOOK_CONFIGS = [
  {
    name: 'Remembrance of the Moon',
    sourceDir: 'Book/Rememberance of the Moon',
    outputFile: 'Remembrance_of_the_Moon_Print_Ready.pdf',
    author: 'Aaron Writer',
    series: 'The Heartline Chronicles - Book 1'
  },
  {
    name: 'The Guardians Choice',
    sourceDir: 'Book/The Guardians Choice/CHAPTERS',
    outputFile: 'The_Guardians_Choice_Print_Ready.pdf',
    author: 'Aaron Writer',
    series: 'The Heartline Chronicles - Book 2'
  },
  {
    name: 'The Evolution',
    sourceDir: 'Book/The Evolution/CHAPTERS',
    outputFile: 'The_Evolution_Print_Ready.pdf',
    author: 'Aaron Writer',
    series: 'The Heartline Chronicles - Book 3'
  },
  {
    name: 'Ascent of the Eternal Spark',
    sourceDir: 'Book/Ascent of the Eternal Spark/CHAPTERS',
    outputFile: 'Ascent_of_the_Eternal_Spark_Print_Ready.pdf',
    author: 'Aaron Writer',
    series: 'Ascent Series - Book One'
  },
  {
    name: 'International Hearts',
    sourceDir: 'Book/International Hearts/CHAPTERS',
    outputFile: 'International_Hearts_Print_Ready.pdf',
    author: 'Aaron Writer',
    series: 'International Hearts Series'
  },
  {
    name: 'Shadow Realms Reborn',
    sourceDir: 'Book/Shadow Realms Reborn',
    outputFile: 'Shadow_Realms_Reborn_Print_Ready.pdf',
    author: 'Aaron Writer',
    series: 'Shadow Realms Reborn Trilogy - Book One',
    needsPreparation: true, // This one needs screenplay cleaning
    chapterDir: 'CHAPTERS' // Chapters are in a subdirectory
  },
  {
    name: 'The Fabric',
    sourceDir: 'Book/Soul Engine/CHAPTERS',
    outputFile: 'The_Fabric_Print_Ready.pdf',
    author: 'Aaron Writer',
    series: 'The Fabric'
  }
];

// Load production status
function loadStatus() {
  if (fs.existsSync(STATUS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf-8'));
    } catch {
      return {};
    }
  }
  return {};
}

// Save production status
function saveStatus(status) {
  fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
}

// Get file modification times
function getFileStats(dir) {
  const stats = {};
  if (!fs.existsSync(dir)) return stats;
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    if (file.isFile() && file.name.endsWith('.md')) {
      const stat = fs.statSync(fullPath);
      stats[file.name] = {
        mtime: stat.mtime.toISOString(),
        size: stat.size
      };
    }
  });
  
  return stats;
}

// Check if book needs update
function needsUpdate(book, currentStatus) {
  const bookStatus = currentStatus[book.name] || {};
  // Determine the path to check for changes
  let sourcePath = path.join(__dirname, '..', book.sourceDir);
  // If book has chapters in a subdirectory, check that directory
  if (book.chapterDir && !book.needsPreparation) {
    sourcePath = path.join(sourcePath, book.chapterDir);
  } else if (book.needsPreparation && book.chapterDir) {
    // For books that need preparation, check the CHAPTERS directory
    sourcePath = path.join(sourcePath, book.chapterDir);
  }
  
  if (!fs.existsSync(sourcePath)) return false;
  
  const currentStats = getFileStats(sourcePath);
  const lastStats = bookStatus.fileStats || {};
  
  // Check if any files changed
  for (const [filename, stats] of Object.entries(currentStats)) {
    const lastStat = lastStats[filename];
    if (!lastStat || lastStat.mtime !== stats.mtime || lastStat.size !== stats.size) {
      return true;
    }
  }
  
  // Check if files were removed
  for (const filename of Object.keys(lastStats)) {
    if (!currentStats[filename]) {
      return true;
    }
  }
  
  return false;
}

// Update a single book
function updateBook(book) {
  console.log(`\n📖 Updating: ${book.name}`);
  
  try {
    let sourceDir = book.sourceDir;
    
    // If book needs preparation (screenplay formatting)
    if (book.needsPreparation) {
      console.log(`   🔧 Preparing book (cleaning screenplay formatting)...`);
      // Prepare script expects book directory (it looks for CHAPTERS subdirectory inside)
      const prepPath = book.sourceDir;
      execSync(`node scripts/prepare-book-for-pdf.js "${prepPath}"`, { stdio: 'inherit' });
      sourceDir = 'Book/pdfs for print/prepared';
    }
    
    // Generate PDF
    console.log(`   📄 Generating PDF...`);
    const relativePath = path.relative(path.join(__dirname, '..'), path.join(__dirname, '..', sourceDir));
    execSync(
      `node scripts/generate-book-pdf.js "${book.name}" "${relativePath}" "${book.author}" "${book.series}" "${book.outputFile}"`,
      { stdio: 'inherit' }
    );
    
    // Update status
    const sourcePath = path.join(__dirname, '..', book.sourceDir);
    const fileStats = getFileStats(sourcePath);
    const pdfPath = path.join(PDF_DIR, book.outputFile);
    const pdfStats = fs.existsSync(pdfPath) ? fs.statSync(pdfPath) : null;
    
    return {
      name: book.name,
      lastUpdated: new Date().toISOString(),
      fileStats,
      pdfSize: pdfStats ? pdfStats.size : 0,
      pdfPages: 'unknown', // Could extract from PDF if needed
      status: 'updated'
    };
  } catch (error) {
    console.error(`   ❌ Error updating ${book.name}:`, error.message);
    return {
      name: book.name,
      lastUpdated: new Date().toISOString(),
      status: 'error',
      error: error.message
    };
  }
}

// Update story build files
function updateStoryBuildFiles() {
  console.log(`\n📚 Updating story build files...`);
  
  const buildFiles = [
    'PRODUCTION_SUMMARY.md',
    'PRODUCTION_COMPLETE_SUMMARY.md',
    'Book/pdfs for print/COMPLETE_PRODUCTION_STATUS.md',
    'Book/pdfs for print/LATEST_PRODUCTION.md'
  ];
  
  // Update production summary
  const summary = generateProductionSummary();
  fs.writeFileSync(
    path.join(__dirname, '..', 'PRODUCTION_SUMMARY.md'),
    summary
  );
  
  console.log(`   ✅ Story build files updated`);
}

// Generate production summary
function generateProductionSummary() {
  const pdfs = fs.readdirSync(PDF_DIR)
    .filter(f => f.endsWith('_Print_Ready.pdf'))
    .map(f => {
      const filePath = path.join(PDF_DIR, f);
      const stats = fs.statSync(filePath);
      return {
        filename: f,
        size: (stats.size / (1024 * 1024)).toFixed(2),
        modified: stats.mtime.toLocaleDateString()
      };
    });
  
  return `# 🚀 Production Summary - Auto-Updated

**Last Updated**: ${new Date().toLocaleString()}

## 📊 Current Status

- **Total PDFs**: ${pdfs.length}
- **Total Size**: ${pdfs.reduce((sum, p) => sum + parseFloat(p.size), 0).toFixed(2)} MB

## 📚 Books Available

${pdfs.map(p => `- ✅ ${p.filename.replace('_Print_Ready.pdf', '').replace(/_/g, ' ')} (${p.size} MB, updated ${p.modified})`).join('\n')}

---

**Note**: This file is automatically updated when books are regenerated.
`;
}

// Main update function
function updateProduction() {
  console.log('🔄 Auto-Updating Production Files...\n');
  
  const status = loadStatus();
  let updatedCount = 0;
  const updatedStatus = { ...status };
  
  BOOK_CONFIGS.forEach(book => {
    const sourcePath = path.join(__dirname, '..', book.sourceDir);
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`⏭️  Skipping ${book.name} (source not found)`);
      return;
    }
    
    if (needsUpdate(book, status)) {
      console.log(`📝 ${book.name} has been modified - updating...`);
      const bookStatus = updateBook(book);
      updatedStatus[book.name] = bookStatus;
      updatedCount++;
    } else {
      console.log(`✅ ${book.name} is up to date`);
    }
  });
  
  // Save updated status
  saveStatus(updatedStatus);
  
  // Update story build files
  if (updatedCount > 0) {
    updateStoryBuildFiles();
    
    // Update dashboard
    console.log(`\n📊 Updating dashboard...`);
    execSync('node scripts/production-dashboard.js', { stdio: 'inherit' });
  }
  
  console.log(`\n✨ Update complete! ${updatedCount} book(s) updated.`);
  return updatedCount;
}

// Watch mode (optional - for continuous monitoring)
function watchMode() {
  console.log('👀 Watching for changes... (Press Ctrl+C to stop)\n');
  
  setInterval(() => {
    const updated = updateProduction();
    if (updated > 0) {
      console.log(`\n⏰ Next check in 60 seconds...\n`);
    }
  }, 60000); // Check every minute
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const watch = args.includes('--watch') || args.includes('-w');
  
  if (watch) {
    updateProduction();
    watchMode();
  } else {
    updateProduction();
  }
}

main();

