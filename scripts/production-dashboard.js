const fs = require('fs');
const path = require('path');

// Production Dashboard - Overview of all books and their status
function generateDashboard() {
  const pdfDir = path.join(__dirname, '..', 'Book', 'pdfs for print');
  const books = [];
  
  // Scan for PDF files
  if (fs.existsSync(pdfDir)) {
    const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf') && f.includes('Print_Ready'));
    
    files.forEach(file => {
      const filePath = path.join(pdfDir, file);
      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      // Extract book name from filename
      const bookName = file.replace('_Print_Ready.pdf', '').replace(/_/g, ' ');
      
      books.push({
        name: bookName,
        filename: file,
        size: `${sizeMB} MB`,
        created: stats.birthtime.toLocaleDateString(),
        modified: stats.mtime.toLocaleDateString()
      });
    });
  }
  
  // Generate dashboard HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book Production Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 2rem;
      text-align: center;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      opacity: 0.9;
      font-size: 1.1rem;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
      background: #f8f9fa;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 0.5rem;
    }
    .stat-label {
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
    }
    .book-card {
      background: white;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }
    .book-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      transform: translateY(-2px);
    }
    .book-title {
      font-size: 1.3rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 1rem;
    }
    .book-info {
      color: #666;
      font-size: 0.9rem;
      margin: 0.5rem 0;
    }
    .book-status {
      display: inline-block;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
      margin-top: 1rem;
      background: #10b981;
      color: white;
    }
    .actions {
      padding: 2rem;
      background: #f8f9fa;
      text-align: center;
    }
    .btn {
      display: inline-block;
      padding: 0.8rem 2rem;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin: 0.5rem;
      transition: all 0.3s ease;
    }
    .btn:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    .footer {
      padding: 2rem;
      text-align: center;
      color: #666;
      border-top: 1px solid #e9ecef;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📚 Book Production Dashboard</h1>
      <p class="subtitle">Complete overview of your published works</p>
    </header>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${books.length}</div>
        <div class="stat-label">Books Published</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${books.reduce((sum, b) => sum + parseFloat(b.size), 0).toFixed(1)}</div>
        <div class="stat-label">Total Size (MB)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${new Date().getFullYear()}</div>
        <div class="stat-label">Current Year</div>
      </div>
    </div>
    
    <div class="books-grid">
      ${books.map(book => `
        <div class="book-card">
          <div class="book-title">${book.name}</div>
          <div class="book-info">📄 ${book.filename}</div>
          <div class="book-info">📊 Size: ${book.size}</div>
          <div class="book-info">📅 Created: ${book.created}</div>
          <div class="book-info">🔄 Modified: ${book.modified}</div>
          <span class="book-status">✅ Print Ready</span>
        </div>
      `).join('')}
    </div>
    
    <div class="actions">
      <a href="#" class="btn" onclick="window.print()">🖨️ Print Report</a>
      <a href="#" class="btn" onclick="location.reload()">🔄 Refresh</a>
    </div>
    
    <div class="footer">
      <p>Generated on ${new Date().toLocaleString()}</p>
      <p>Book Production System v1.0</p>
    </div>
  </div>
</body>
</html>`;
  
  const outputPath = path.join(__dirname, '..', 'Book', 'pdfs for print', 'dashboard.html');
  fs.writeFileSync(outputPath, html);
  console.log(`✅ Dashboard generated: ${outputPath}`);
  console.log(`📊 Total books: ${books.length}`);
  
  return { books, outputPath };
}

generateDashboard();

