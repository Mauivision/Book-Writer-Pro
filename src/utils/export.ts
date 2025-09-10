import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { Chapter, Character } from '@/types'

// Standard book sizes (in mm)
const BOOK_SIZES = {
  TRADE_PAPERBACK: { width: 152, height: 229 }, // 6" x 9"
  MASS_MARKET: { width: 105, height: 171 },     // 4.125" x 6.75"
  HARDCOVER: { width: 152, height: 229 },       // 6" x 9"
}

// Print margins (in mm)
const PRINT_MARGINS = {
  TOP: 20,
  BOTTOM: 20,
  LEFT: 25,
  RIGHT: 25,
}

interface BookMetadata {
  title: string
  author: string
  isbn?: string
  publisher?: string
  copyrightYear?: number
}

export async function exportToPDF(chapters: Chapter[], title: string) {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(24)
  doc.text(title, 20, 20)
  
  let y = 40
  chapters.forEach((chapter, index) => {
    // Add chapter title
    doc.setFontSize(18)
    doc.text(`Chapter ${index + 1}: ${chapter.title}`, 20, y)
    y += 10
    
    // Add chapter content
    doc.setFontSize(12)
    const content = chapter.content.replace(/<[^>]*>/g, '') // Remove HTML tags
    const lines = doc.splitTextToSize(content, 170)
    doc.text(lines, 20, y)
    y += lines.length * 7
    
    // Add page break if not last chapter
    if (index < chapters.length - 1) {
      doc.addPage()
      y = 20
    }
  })
  
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`)
}

export async function exportToEPUB(chapters: Chapter[], title: string) {
  const content = `
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <title>${title}</title>
      <meta charset="utf-8" />
    </head>
    <body>
      <h1>${title}</h1>
      ${chapters.map((chapter, index) => `
        <h2>Chapter ${index + 1}: ${chapter.title}</h2>
        ${chapter.content}
      `).join('')}
    </body>
    </html>
  `
  
  const blob = new Blob([content], { type: 'application/epub+zip' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.epub`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportToMarkdown(chapters: Chapter[], title: string) {
  const content = `# ${title}\n\n${chapters.map((chapter, index) => 
    `## Chapter ${index + 1}: ${chapter.title}\n\n${chapter.content.replace(/<[^>]*>/g, '')}\n\n`
  ).join('')}`
  
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.md`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportCharacterSheet(characters: Character[]) {
  const content = characters.map(char => `
    # ${char.name}
    Role: ${char.role}
    
    ## Description
    ${char.description}
    
    ## Relationships
    ${char.relationships.map(rel => {
      const targetChar = characters.find(c => c.id === rel.targetId)
      return `- ${targetChar?.name || 'Unknown'}: ${rel.type}`
    }).join('\n')}
  `).join('\n\n')
  
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'character-sheet.md'
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportToPrintReadyPDF(
  chapters: Chapter[],
  metadata: BookMetadata,
  options: {
    bookSize: keyof typeof BOOK_SIZES
    includeCover: boolean
    includeCopyright: boolean
    includeTableOfContents: boolean
  }
) {
  const { width, height } = BOOK_SIZES[options.bookSize]
  const doc = new jsPDF({
    unit: 'mm',
    format: [width, height],
    orientation: 'portrait'
  })

  // Set up fonts
  doc.setFont('helvetica')
  doc.setFontSize(12)

  let currentPage = 1

  // Add cover page if requested
  if (options.includeCover) {
    doc.setFontSize(24)
    doc.text(metadata.title, width / 2, height / 2 - 20, { align: 'center' })
    doc.setFontSize(16)
    doc.text(metadata.author, width / 2, height / 2 + 10, { align: 'center' })
    currentPage++
  }

  // Add copyright page if requested
  if (options.includeCopyright) {
    doc.addPage()
    doc.setFontSize(10)
    const copyrightText = `Copyright © ${metadata.copyrightYear || new Date().getFullYear()} ${metadata.author}
All rights reserved.
${metadata.publisher ? `Published by ${metadata.publisher}` : ''}
${metadata.isbn ? `ISBN: ${metadata.isbn}` : ''}`
    doc.text(copyrightText, PRINT_MARGINS.LEFT, PRINT_MARGINS.TOP + 20)
    currentPage++
  }

  // Add table of contents if requested
  if (options.includeTableOfContents) {
    doc.addPage()
    doc.setFontSize(16)
    doc.text('Table of Contents', PRINT_MARGINS.LEFT, PRINT_MARGINS.TOP + 20)
    doc.setFontSize(12)
    
    let tocY = PRINT_MARGINS.TOP + 40
    chapters.forEach((chapter, index) => {
      if (tocY > height - PRINT_MARGINS.BOTTOM) {
        doc.addPage()
        tocY = PRINT_MARGINS.TOP + 20
      }
      doc.text(`${index + 1}. ${chapter.title}`, PRINT_MARGINS.LEFT, tocY)
      tocY += 10
    })
    currentPage++
  }

  // Add chapters
  for (const chapter of chapters) {
    doc.addPage()
    
    // Add chapter title
    doc.setFontSize(16)
    doc.text(chapter.title, PRINT_MARGINS.LEFT, PRINT_MARGINS.TOP + 20)
    
    // Add chapter content
    doc.setFontSize(12)
    const contentLines = doc.splitTextToSize(
      chapter.content.replace(/<[^>]*>/g, ''), // Remove HTML tags
      width - PRINT_MARGINS.LEFT - PRINT_MARGINS.RIGHT
    )
    
    let y = PRINT_MARGINS.TOP + 40
    for (const line of contentLines) {
      if (y > height - PRINT_MARGINS.BOTTOM) {
        doc.addPage()
        y = PRINT_MARGINS.TOP + 20
      }
      doc.text(line, PRINT_MARGINS.LEFT, y)
      y += 7
    }
    currentPage++
  }

  // Save the PDF
  doc.save(`${metadata.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_print_ready.pdf`)
}

// Export to InDesign-compatible format (IDML)
export function exportToIDML(chapters: Chapter[], metadata: BookMetadata) {
  // This is a placeholder for IDML export
  // InDesign Markup Language (IDML) export would require a more complex implementation
  // or integration with Adobe's InDesign Server
  console.log('IDML export not implemented yet')
}

// Export to print-ready EPUB
export function exportToPrintReadyEPUB(chapters: Chapter[], metadata: BookMetadata) {
  // This is a placeholder for print-ready EPUB export
  // Would need to implement proper EPUB3 with print-specific CSS
  console.log('Print-ready EPUB export not implemented yet')
} 