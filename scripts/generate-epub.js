const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if epub-gen is available, if not provide instructions
function checkEPUBDependencies() {
  try {
    execSync('which epub-gen || echo "not found"', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Simple EPUB generator using Node.js
function generateEPUB(chapters, metadata, outputPath) {
  const epubDir = path.join(path.dirname(outputPath), path.basename(outputPath, '.epub'));
  
  // Create EPUB directory structure
  if (!fs.existsSync(epubDir)) {
    fs.mkdirSync(epubDir, { recursive: true });
  }
  
  const META_INF = path.join(epubDir, 'META-INF');
  const OEBPS = path.join(epubDir, 'OEBPS');
  const OEBPS_Text = path.join(OEBPS, 'Text');
  
  [META_INF, OEBPS, OEBPS_Text].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // 1. mimetype file
  fs.writeFileSync(path.join(epubDir, 'mimetype'), 'application/epub+zip');

  // 2. META-INF/container.xml
  const containerXML = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  fs.writeFileSync(path.join(META_INF, 'container.xml'), containerXML);

  // 3. Generate chapter HTML files
  const chapterFiles = [];
  chapters.forEach((chapter, index) => {
    const chapterNum = index + 1;
    const filename = `chapter-${chapterNum}.xhtml`;
    const filepath = path.join(OEBPS_Text, filename);
    
    const cleanContent = chapter.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^#+\s*(.+)$/gm, '<h2>$1</h2>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
    
    const chapterHTML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Chapter ${chapterNum}: ${chapter.title}</title>
  <link rel="stylesheet" type="text/css" href="../Styles/style.css"/>
  <meta charset="utf-8"/>
</head>
<body>
  <section epub:type="chapter">
    <h1>Chapter ${chapterNum}: ${chapter.title}</h1>
    ${cleanContent}
  </section>
</body>
</html>`;
    
    fs.writeFileSync(filepath, chapterHTML);
    chapterFiles.push({
      id: `chapter-${chapterNum}`,
      href: `Text/${filename}`,
      title: `Chapter ${chapterNum}: ${chapter.title}`
    });
  });

  // 4. CSS file
  const css = `body {
  font-family: Georgia, serif;
  line-height: 1.6;
  margin: 1em;
  padding: 0;
}

h1 {
  font-size: 2em;
  margin-top: 2em;
  margin-bottom: 1em;
  text-align: center;
}

h2 {
  font-size: 1.5em;
  margin-top: 1.5em;
  margin-bottom: 1em;
}

p {
  margin: 1em 0;
  text-align: justify;
  text-indent: 1.5em;
}

p:first-of-type {
  text-indent: 0;
}`;
  fs.writeFileSync(path.join(OEBPS, 'Styles', 'style.css'), css);
  if (!fs.existsSync(path.join(OEBPS, 'Styles'))) {
    fs.mkdirSync(path.join(OEBPS, 'Styles'), { recursive: true });
  }

  // 5. content.opf (package file)
  const now = new Date().toISOString();
  const contentOPF = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${metadata.title}</dc:title>
    <dc:creator>${metadata.author}</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="book-id">urn:uuid:${Date.now()}</dc:identifier>
    <dc:date>${now}</dc:date>
    <meta property="dcterms:modified">${now}</meta>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="style" href="Styles/style.css" media-type="text/css"/>
    ${chapterFiles.map((ch, i) => `
    <item id="${ch.id}" href="${ch.href}" media-type="application/xhtml+xml"/>`).join('')}
  </manifest>
  <spine toc="ncx">
    <itemref idref="nav"/>
    ${chapterFiles.map(ch => `<itemref idref="${ch.id}"/>`).join('')}
  </spine>
</package>`;
  fs.writeFileSync(path.join(OEBPS, 'content.opf'), contentOPF);

  // 6. toc.ncx (navigation)
  const tocNCX = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${Date.now()}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${metadata.title}</text>
  </docTitle>
  <navMap>
    ${chapterFiles.map((ch, i) => `
    <navPoint id="navpoint-${i + 1}" playOrder="${i + 1}">
      <navLabel><text>${ch.title}</text></navLabel>
      <content src="${ch.href}"/>
    </navPoint>`).join('')}
  </navMap>
</ncx>`;
  fs.writeFileSync(path.join(OEBPS, 'toc.ncx'), tocNCX);

  // 7. nav.xhtml (EPUB 3 navigation)
  const navXHTML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Navigation</title>
  <meta charset="utf-8"/>
  <link rel="stylesheet" type="text/css" href="Styles/style.css"/>
</head>
<body>
  <nav epub:type="toc">
    <h1>Table of Contents</h1>
    <ol>
      ${chapterFiles.map(ch => `<li><a href="${ch.href}">${ch.title}</a></li>`).join('')}
    </ol>
  </nav>
</body>
</html>`;
  fs.writeFileSync(path.join(OEBPS, 'nav.xhtml'), navXHTML);

  console.log(`✅ EPUB structure created: ${epubDir}`);
  console.log(`📦 To create final EPUB file, zip the contents:`);
  console.log(`   cd "${epubDir}"`);
  console.log(`   zip -r "../${path.basename(outputPath)}" . -x "*.DS_Store"`);
  console.log(`\n💡 Or use a tool like 7-Zip to zip all files in the directory.`);
  
  return epubDir;
}

// Main execution
function main() {
  const bookDir = process.argv[2] || 'Book/Rememberance of the Moon';
  const outputName = process.argv[3] || 'Remembrance_of_the_Moon.epub';
  const author = process.argv[4] || 'Aaron Writer';
  const series = process.argv[5] || 'The Heartline Chronicles - Book 1';
  
  const bookPath = path.join(__dirname, '..', bookDir);
  const outputPath = path.join(__dirname, '..', 'Book', 'pdfs for print', outputName);
  
  console.log('📖 Generating EPUB...');
  console.log(`📚 Reading from: ${bookPath}`);
  
  if (!fs.existsSync(bookPath)) {
    console.error(`❌ Error: Directory not found: ${bookPath}`);
    process.exit(1);
  }
  
  // Parse chapters (reuse logic from PDF generator)
  const files = fs.readdirSync(bookPath).filter(f => 
    (f.startsWith('chapter-') || f.startsWith('Chapter-')) && f.endsWith('.md')
  );
  
  files.sort((a, b) => {
    const numA = parseInt(a.match(/(?:chapter|Chapter)-(\d+)/i)?.[1] || '0');
    const numB = parseInt(b.match(/(?:chapter|Chapter)-(\d+)/i)?.[1] || '0');
    return numA - numB;
  });
  
  const chapters = [];
  files.forEach((file, index) => {
    const filePath = path.join(bookPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const chapterMatch = file.match(/(?:chapter|Chapter)-(\d+)/i);
    const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : index + 1;
    
    let title = `Chapter ${chapterNumber}`;
    const titleMatch = content.match(/^#+\s*.*?(?:Chapter|chapter)\s*\d+[:\s]*(.+?)(?:\n|$)/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }
    
    let chapterContent = content
      .replace(/^#+\s*.*?(?:Chapter|chapter)\s*\d+[:\s]*.*?\n+/i, '')
      .replace(/^#+\s*.+\n+/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    if (chapterContent.length > 0) {
      chapters.push({ number: chapterNumber, title, content: chapterContent });
    }
  });
  
  if (chapters.length === 0) {
    console.error('❌ No chapters found');
    process.exit(1);
  }
  
  const metadata = {
    title: path.basename(bookDir),
    author,
    series
  };
  
  generateEPUB(chapters, metadata, outputPath);
  console.log(`\n✨ EPUB generation complete!`);
  console.log(`📚 Chapters: ${chapters.length}`);
}

main();

