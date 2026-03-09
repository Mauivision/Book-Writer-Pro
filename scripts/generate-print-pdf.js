const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

// Book metadata
const BOOK_METADATA = {
  title: 'Remembrance of the Moon',
  author: 'Aaron Writer',
  series: 'The Heartline Chronicles - Book 1',
  copyrightYear: new Date().getFullYear(),
  publisher: 'Self-Published',
  isbn: '' // Add ISBN if available
};

// Print settings
const PRINT_SETTINGS = {
  bookSize: 'TRADE_PAPERBACK', // 6" x 9" (152mm x 229mm)
  pageWidth: 152, // mm
  pageHeight: 229, // mm
  margins: {
    top: 25, // mm
    bottom: 25, // mm
    left: 20, // mm
    right: 20 // mm
  },
  fontSize: {
    title: 24,
    chapterTitle: 18,
    body: 11,
    toc: 12
  },
  lineHeight: 5.5, // mm
  chapterSpacing: 20 // mm
};

// Parse markdown chapters from individual chapter files
function parseChaptersFromDirectory(directoryPath) {
  const chapters = [];
  const files = fs.readdirSync(directoryPath).filter(f => f.startsWith('chapter-') && f.endsWith('.md'));
  
  // Sort files by chapter number
  files.sort((a, b) => {
    const numA = parseInt(a.match(/chapter-(\d+)/)?.[1] || '0');
    const numB = parseInt(b.match(/chapter-(\d+)/)?.[1] || '0');
    return numA - numB;
  });
  
  files.forEach((file, index) => {
    const filePath = path.join(directoryPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract chapter number from filename
    const chapterMatch = file.match(/chapter-(\d+)/);
    const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : index + 1;
    
    // Extract title (first line after # or ##)
    let title = `Chapter ${chapterNumber}`;
    const titleMatch = content.match(/^#+\s*.*?Chapter\s*\d+[:\s]*(.+?)(?:\n|$)/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    } else {
      const altMatch = content.match(/^#+\s*(.+?)(?:\n|$)/);
      if (altMatch) {
        title = altMatch[1].replace(/^Chapter\s*\d+[:\s]*/i, '').trim();
      }
    }
    
    // Clean content
    let chapterContent = content
      .replace(/^#+\s*.*?Chapter\s*\d+[:\s]*.*?\n+/i, '') // Remove chapter header
      .replace(/^#+\s*.+\n+/gm, '') // Remove other headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      .replace(/^[-*+]\s+/gm, '') // Remove list markers
      .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
      .trim();
    
    if (chapterContent.length > 0) {
      chapters.push({
        number: chapterNumber,
        title: title || `Chapter ${chapterNumber}`,
        content: chapterContent
      });
    }
  });
  
  return chapters;
}

// Generate print-ready PDF
function generatePDF(chapters, outputPath) {
  const doc = new jsPDF({
    unit: 'mm',
    format: [PRINT_SETTINGS.pageWidth, PRINT_SETTINGS.pageHeight],
    orientation: 'portrait'
  });

  let currentPage = 1;
  const { pageWidth, pageHeight, margins, fontSize, lineHeight } = PRINT_SETTINGS;
  const contentWidth = pageWidth - margins.left - margins.right;
  const contentHeight = pageHeight - margins.top - margins.bottom;

  // === COVER PAGE ===
  doc.setFontSize(fontSize.title);
  doc.setFont('helvetica', 'bold');
  doc.text(BOOK_METADATA.title, pageWidth / 2, pageHeight / 2 - 30, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(BOOK_METADATA.series, pageWidth / 2, pageHeight / 2 - 10, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(BOOK_METADATA.author, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
  
  currentPage++;

  // === TITLE PAGE ===
  doc.addPage();
  doc.setFontSize(fontSize.title);
  doc.setFont('helvetica', 'bold');
  doc.text(BOOK_METADATA.title, pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(BOOK_METADATA.series, pageWidth / 2, pageHeight / 2, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(BOOK_METADATA.author, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
  
  currentPage++;

  // === COPYRIGHT PAGE ===
  doc.addPage();
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const copyrightText = [
    `Copyright © ${BOOK_METADATA.copyrightYear} ${BOOK_METADATA.author}`,
    '',
    'All rights reserved.',
    '',
    BOOK_METADATA.publisher ? `Published by ${BOOK_METADATA.publisher}` : '',
    BOOK_METADATA.isbn ? `ISBN: ${BOOK_METADATA.isbn}` : '',
    '',
    'This book is a work of fiction. Names, characters, places, and incidents',
    'are products of the author\'s imagination or are used fictitiously.',
    '',
    'No part of this publication may be reproduced, distributed, or transmitted',
    'in any form or by any means, without the prior written permission of the publisher.'
  ].filter(Boolean);
  
  let yPos = margins.top + 30;
  copyrightText.forEach(line => {
    doc.text(line, pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
  });
  
  currentPage++;

  // === TABLE OF CONTENTS ===
  doc.addPage();
  doc.setFontSize(fontSize.chapterTitle);
  doc.setFont('helvetica', 'bold');
  doc.text('Table of Contents', margins.left, margins.top + 15);
  
  doc.setFontSize(fontSize.toc);
  doc.setFont('helvetica', 'normal');
  
  let tocY = margins.top + 35;
  chapters.forEach((chapter) => {
    if (tocY > pageHeight - margins.bottom - 20) {
      doc.addPage();
      tocY = margins.top + 20;
      currentPage++;
    }
    
    const chapterText = `Chapter ${chapter.number}: ${chapter.title}`;
    doc.text(chapterText, margins.left, tocY);
    tocY += lineHeight + 2;
  });
  
  currentPage++;

  // === CHAPTERS ===
  chapters.forEach((chapter, chapterIndex) => {
    // New page for each chapter
    if (chapterIndex > 0) {
      doc.addPage();
      currentPage++;
    }
    
    // Chapter title
    doc.setFontSize(fontSize.chapterTitle);
    doc.setFont('helvetica', 'bold');
    const chapterTitle = `Chapter ${chapter.number}`;
    doc.text(chapterTitle, margins.left, margins.top + 20);
    
    if (chapter.title) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(fontSize.body + 2);
      doc.text(chapter.title, margins.left, margins.top + 30);
    }
    
    // Chapter content
    doc.setFontSize(fontSize.body);
    doc.setFont('helvetica', 'normal');
    
    // Split content into lines that fit the page width
    const content = chapter.content.replace(/\n{3,}/g, '\n\n');
    const lines = doc.splitTextToSize(content, contentWidth);
    
    let yPos = margins.top + 45;
    
    lines.forEach((line) => {
      // Check if we need a new page
      if (yPos > pageHeight - margins.bottom) {
        doc.addPage();
        yPos = margins.top + 20;
        currentPage++;
      }
      
      // Skip empty lines that would waste space
      if (line.trim() === '' && yPos > margins.top + 40) {
        yPos += lineHeight * 0.5;
        return;
      }
      
      doc.text(line, margins.left, yPos);
      yPos += lineHeight;
    });
    
    // Add some space after chapter
    if (chapterIndex < chapters.length - 1) {
      // Already starting new page for next chapter
    }
  });

  // Save PDF
  doc.save(outputPath);
  console.log(`✅ PDF generated successfully: ${outputPath}`);
  console.log(`📄 Total pages: ${currentPage}`);
  console.log(`📚 Total chapters: ${chapters.length}`);
}

// Main execution
function main() {
  const bookDir = path.join(__dirname, '../Book/Rememberance of the Moon');
  const outputPath = path.join(__dirname, '../Book/pdfs for print/Remembrance_of_the_Moon_Print_Ready.pdf');
  
  console.log('📖 Generating print-ready PDF...');
  console.log(`📝 Reading from directory: ${bookDir}`);
  
  if (!fs.existsSync(bookDir)) {
    console.error(`❌ Error: Book directory not found at ${bookDir}`);
    process.exit(1);
  }
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    const chapters = parseChaptersFromDirectory(bookDir);
    console.log(`📚 Found ${chapters.length} chapters`);
    
    if (chapters.length === 0) {
      console.error('❌ Error: No chapters found in the book directory');
      console.log('💡 Make sure chapter files are named like: chapter-1-title.md');
      process.exit(1);
    }
    
    // Log chapter titles
    chapters.forEach(ch => {
      console.log(`   - Chapter ${ch.number}: ${ch.title}`);
    });
    
    generatePDF(chapters, outputPath);
    console.log('✨ PDF generation complete!');
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

main();
