/**
 * BOOK CONSISTENCY CHECKER
 * Checks for consistency issues across book collection
 */

const fs = require('fs');
const path = require('path');

class ConsistencyChecker {
  constructor() {
    this.issues = [];
    this.characterProfiles = new Map();
    this.worldBuildingRules = new Map();
  }

  // Load character profiles from all books
  loadCharacterProfiles() {
    const booksDir = path.join(__dirname, '..');
    const books = fs.readdirSync(booksDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    books.forEach(book => {
      const profilesDir = path.join(booksDir, book, 'CHARACTER_PROFILES');
      if (fs.existsSync(profilesDir)) {
        const profiles = fs.readdirSync(profilesDir)
          .filter(f => f.endsWith('.md'))
          .map(f => {
            const content = fs.readFileSync(path.join(profilesDir, f), 'utf8');
            return this.parseCharacterProfile(content, book);
          });
        
        profiles.forEach(profile => {
          const key = `${book}:${profile.name}`;
          this.characterProfiles.set(key, profile);
        });
      }
    });
  }

  parseCharacterProfile(content, book) {
    const profile = {
      book,
      name: '',
      age: null,
      occupation: '',
      physical: {},
      traits: []
    };

    // Extract name
    const nameMatch = content.match(/# CHARACTER PROFILE: (.+)/);
    if (nameMatch) profile.name = nameMatch[1].trim();

    // Extract age
    const ageMatch = content.match(/- \*\*Age\*\*: (\d+)/);
    if (ageMatch) profile.age = parseInt(ageMatch[1]);

    // Extract occupation
    const occMatch = content.match(/- \*\*Occupation\*\*: (.+)/);
    if (occMatch) profile.occupation = occMatch[1].trim();

    // Extract physical details
    const heightMatch = content.match(/- \*\*Height\*\*: (.+)/);
    if (heightMatch) profile.physical.height = heightMatch[1].trim();

    const hairMatch = content.match(/- \*\*Hair\*\*: (.+)/);
    if (hairMatch) profile.physical.hair = hairMatch[1].trim();

    const eyesMatch = content.match(/- \*\*Eyes\*\*: (.+)/);
    if (eyesMatch) profile.physical.eyes = eyesMatch[1].trim();

    return profile;
  }

  // Check character name consistency in chapters
  checkCharacterNames(bookPath) {
    const chaptersDir = path.join(bookPath, 'CHAPTERS');
    if (!fs.existsSync(chaptersDir)) return;

    const chapters = fs.readdirSync(chaptersDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        name: f,
        path: path.join(chaptersDir, f),
        content: fs.readFileSync(path.join(chaptersDir, f), 'utf8')
      }));

    // Get character profiles for this book
    const bookName = path.basename(bookPath);
    const bookCharacters = Array.from(this.characterProfiles.values())
      .filter(c => c.book === bookName);

    bookCharacters.forEach(character => {
      const nameVariations = this.getPossibleNameVariations(character.name);
      
      chapters.forEach(chapter => {
        // Check for name consistency
        const nameMatches = nameVariations.map(v => {
          const regex = new RegExp(`\\b${v}\\b`, 'gi');
          return (chapter.content.match(regex) || []).length;
        });

        const totalMatches = nameMatches.reduce((a, b) => a + b, 0);
        
        if (totalMatches > 0) {
          // Check if primary name is used consistently
          const primaryMatches = (chapter.content.match(new RegExp(`\\b${character.name}\\b`, 'gi')) || []).length;
          const consistencyRatio = primaryMatches / totalMatches;

          if (consistencyRatio < 0.8 && totalMatches > 2) {
            this.issues.push({
              type: 'character_name',
              severity: 'medium',
              book: bookName,
              chapter: chapter.name,
              character: character.name,
              issue: `Inconsistent name usage: only ${Math.round(consistencyRatio * 100)}% uses primary name`,
              suggestion: `Standardize to "${character.name}" throughout`
            });
          }
        }
      });
    });
  }

  getPossibleNameVariations(name) {
    const parts = name.split(' ');
    const variations = [name];
    
    if (parts.length > 1) {
      variations.push(parts[0]); // First name only
      variations.push(parts[parts.length - 1]); // Last name only
    }
    
    return variations;
  }

  // Check formatting consistency
  checkFormatting(bookPath) {
    const chaptersDir = path.join(bookPath, 'CHAPTERS');
    if (!fs.existsSync(chaptersDir)) return;

    const chapters = fs.readdirSync(chaptersDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        name: f,
        content: fs.readFileSync(path.join(chaptersDir, f), 'utf8')
      }));

    const bookName = path.basename(bookPath);
    
    chapters.forEach(chapter => {
      // Check chapter title format
      if (!chapter.content.match(/^# Chapter \d+:/m)) {
        this.issues.push({
          type: 'formatting',
          severity: 'low',
          book: bookName,
          chapter: chapter.name,
          issue: 'Chapter title format inconsistent',
          suggestion: 'Use format: "# Chapter [Number]: [Title]"'
        });
      }

      // Check word count tracking
      if (!chapter.content.match(/\*\*Word Count\*\*:/)) {
        this.issues.push({
          type: 'formatting',
          severity: 'low',
          book: bookName,
          chapter: chapter.name,
          issue: 'Missing word count tracking',
          suggestion: 'Add "**Word Count**: [number]"'
        });
      }

      // Check dialogue format
      const dialogueLines = chapter.content.match(/^\*\*[A-Z]+\*\*:/gm) || [];
      const inconsistentDialogue = dialogueLines.filter(line => {
        return !line.match(/^\*\*[A-Z][A-Z\s]+\*\*: \(/);
      });

      if (inconsistentDialogue.length > 0) {
        this.issues.push({
          type: 'formatting',
          severity: 'medium',
          book: bookName,
          chapter: chapter.name,
          issue: `${inconsistentDialogue.length} dialogue lines missing stage directions`,
          suggestion: 'Use format: "**CHARACTER:** (stage direction) "Dialogue"'
        });
      }
    });
  }

  // Check timeline consistency
  checkTimeline(bookPath) {
    const chaptersDir = path.join(bookPath, 'CHAPTERS');
    if (!fs.existsSync(chaptersDir)) return;

    const chapters = fs.readdirSync(chaptersDir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .map(f => ({
        name: f,
        number: this.extractChapterNumber(f),
        content: fs.readFileSync(path.join(chaptersDir, f), 'utf8')
      }));

    const bookName = path.basename(bookPath);
    
    // Extract time markers
    chapters.forEach((chapter, index) => {
      const timeMarkers = chapter.content.match(/\*([^*]+)\*/g) || [];
      const dates = timeMarkers.filter(m => /\d+/.test(m));
      
      if (dates.length > 0 && index > 0) {
        // Compare with previous chapter
        const prevChapter = chapters[index - 1];
        const prevDates = (prevChapter.content.match(/\*([^*]+)\*/g) || [])
          .filter(m => /\d+/.test(m));
        
        // Basic timeline check (can be expanded)
        if (prevDates.length > 0 && dates.length > 0) {
          // Check if time progression makes sense
          // This is a simplified check - can be enhanced
        }
      }
    });
  }

  extractChapterNumber(filename) {
    const match = filename.match(/Chapter[-\s]?(\d+)/i);
    return match ? parseInt(match[1]) : 0;
  }

  // Generate consistency report
  generateReport() {
    const report = {
      totalIssues: this.issues.length,
      byType: {},
      bySeverity: {},
      byBook: {},
      issues: this.issues
    };

    this.issues.forEach(issue => {
      // Group by type
      report.byType[issue.type] = (report.byType[issue.type] || 0) + 1;
      
      // Group by severity
      report.bySeverity[issue.severity] = (report.bySeverity[issue.severity] || 0) + 1;
      
      // Group by book
      report.byBook[issue.book] = (report.byBook[issue.book] || 0) + 1;
    });

    return report;
  }

  // Run all checks
  runAllChecks() {
    const booksDir = path.join(__dirname, '..');
    const books = fs.readdirSync(booksDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(booksDir, dirent.name));

    console.log('Loading character profiles...');
    this.loadCharacterProfiles();
    console.log(`Loaded ${this.characterProfiles.size} character profiles`);

    console.log('\nRunning consistency checks...');
    books.forEach(bookPath => {
      const bookName = path.basename(bookPath);
      console.log(`Checking ${bookName}...`);
      
      this.checkCharacterNames(bookPath);
      this.checkFormatting(bookPath);
      this.checkTimeline(bookPath);
    });

    console.log(`\nFound ${this.issues.length} consistency issues`);
    return this.generateReport();
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConsistencyChecker;
}

// Run if called directly
if (require.main === module) {
  const checker = new ConsistencyChecker();
  const report = checker.runAllChecks();
  
  console.log('\n=== CONSISTENCY REPORT ===');
  console.log(`Total Issues: ${report.totalIssues}`);
  console.log('\nBy Type:', report.byType);
  console.log('By Severity:', report.bySeverity);
  console.log('By Book:', report.byBook);
  
  if (report.issues.length > 0) {
    console.log('\n=== ISSUES ===');
    report.issues.forEach((issue, index) => {
      console.log(`\n${index + 1}. [${issue.severity.toUpperCase()}] ${issue.type}`);
      console.log(`   Book: ${issue.book}`);
      console.log(`   Chapter: ${issue.chapter}`);
      if (issue.character) console.log(`   Character: ${issue.character}`);
      console.log(`   Issue: ${issue.issue}`);
      console.log(`   Suggestion: ${issue.suggestion}`);
    });
  }
}

