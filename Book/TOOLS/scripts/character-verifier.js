/**
 * CHARACTER VERIFIER
 * Verifies character details match between profiles and chapters
 */

const fs = require('fs');
const path = require('path');

class CharacterVerifier {
  constructor() {
    this.characterDetails = new Map();
    this.inconsistencies = [];
  }

  // Verify character consistency for a specific book
  verifyBook(bookPath) {
    const bookName = path.basename(bookPath);
    console.log(`\nVerifying ${bookName}...`);

    // Load character profiles
    const profilesDir = path.join(bookPath, 'CHARACTER_PROFILES');
    if (!fs.existsSync(profilesDir)) {
      console.log(`  No CHARACTER_PROFILES directory found`);
      return;
    }

    const profiles = fs.readdirSync(profilesDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        filename: f,
        content: fs.readFileSync(path.join(profilesDir, f), 'utf8')
      }));

    // Load chapters
    const chaptersDir = path.join(bookPath, 'CHAPTERS');
    if (!fs.existsSync(chaptersDir)) {
      console.log(`  No CHAPTERS directory found`);
      return;
    }

    const chapters = fs.readdirSync(chaptersDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        filename: f,
        content: fs.readFileSync(path.join(chaptersDir, f), 'utf8')
      }));

    // Verify each character
    profiles.forEach(profile => {
      const characterData = this.parseProfile(profile.content);
      const characterName = characterData.name;

      if (!characterName) {
        console.log(`  Warning: Could not parse name from ${profile.filename}`);
        return;
      }

      console.log(`  Checking ${characterName}...`);

      // Check chapters for this character
      chapters.forEach(chapter => {
        if (chapter.content.toLowerCase().includes(characterName.toLowerCase())) {
          this.verifyCharacterInChapter(characterName, characterData, chapter, bookName);
        }
      });
    });

    return this.inconsistencies;
  }

  parseProfile(content) {
    const data = {
      name: '',
      age: null,
      occupation: '',
      height: '',
      hair: '',
      eyes: '',
      build: ''
    };

    // Extract name
    const nameMatch = content.match(/# CHARACTER PROFILE: (.+)/);
    if (nameMatch) data.name = nameMatch[1].trim();

    // Extract age
    const ageMatch = content.match(/- \*\*Age\*\*: (\d+)/);
    if (ageMatch) data.age = parseInt(ageMatch[1]);

    // Extract occupation
    const occMatch = content.match(/- \*\*Occupation\*\*: (.+)/);
    if (occMatch) data.occupation = occMatch[1].trim();

    // Extract physical details
    const heightMatch = content.match(/- \*\*Height\*\*: (.+)/);
    if (heightMatch) data.height = heightMatch[1].trim();

    const hairMatch = content.match(/- \*\*Hair\*\*: (.+)/);
    if (hairMatch) data.hair = hairMatch[1].trim();

    const eyesMatch = content.match(/- \*\*Eyes\*\*: (.+)/);
    if (eyesMatch) data.eyes = eyesMatch[1].trim();

    const buildMatch = content.match(/- \*\*Build\*\*: (.+)/);
    if (buildMatch) data.build = buildMatch[1].trim();

    return data;
  }

  verifyCharacterInChapter(characterName, profileData, chapter, bookName) {
    const content = chapter.content.toLowerCase();
    const nameLower = characterName.toLowerCase();

    // Check for name variations
    const nameParts = characterName.split(' ');
    const variations = [characterName, nameParts[0], nameParts[nameParts.length - 1]];

    // Verify physical descriptions match
    if (profileData.height) {
      const heightPatterns = [
        profileData.height.toLowerCase(),
        profileData.height.replace(/["']/g, '').toLowerCase()
      ];
      
      const hasHeight = heightPatterns.some(pattern => 
        content.includes(pattern.toLowerCase())
      );
      
      // Height might not appear in every chapter, so this is informational
    }

    // Check for obvious inconsistencies
    if (profileData.hair) {
      const hairColors = ['blonde', 'brown', 'black', 'red', 'gray', 'white', 'brunette'];
      const mentionedHair = hairColors.filter(color => 
        content.includes(color) && content.indexOf(color) < content.indexOf(nameLower) + 200
      );

      if (mentionedHair.length > 0) {
        const profileHairLower = profileData.hair.toLowerCase();
        const matches = mentionedHair.some(color => profileHairLower.includes(color));
        
        if (!matches && mentionedHair.length > 0) {
          this.inconsistencies.push({
            type: 'physical_description',
            severity: 'medium',
            book: bookName,
            chapter: chapter.filename,
            character: characterName,
            issue: `Hair color mentioned (${mentionedHair.join(', ')}) doesn't match profile (${profileData.hair})`,
            suggestion: `Verify hair color matches profile: "${profileData.hair}"`
          });
        }
      }
    }
  }

  // Generate verification report
  generateReport() {
    return {
      totalInconsistencies: this.inconsistencies.length,
      byType: this.groupBy(this.inconsistencies, 'type'),
      bySeverity: this.groupBy(this.inconsistencies, 'severity'),
      byBook: this.groupBy(this.inconsistencies, 'book'),
      inconsistencies: this.inconsistencies
    };
  }

  groupBy(array, key) {
    return array.reduce((result, item) => {
      const group = item[key];
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CharacterVerifier;
}

// Run if called directly
if (require.main === module) {
  const verifier = new CharacterVerifier();
  
  // Check International Hearts as example
  const bookPath = path.join(__dirname, '..', 'International Hearts');
  if (fs.existsSync(bookPath)) {
    verifier.verifyBook(bookPath);
    const report = verifier.generateReport();
    
    console.log('\n=== VERIFICATION REPORT ===');
    console.log(`Total Inconsistencies: ${report.totalInconsistencies}`);
    console.log('\nBy Type:', report.byType);
    console.log('By Severity:', report.bySeverity);
    
    if (report.inconsistencies.length > 0) {
      console.log('\n=== INCONSISTENCIES ===');
      report.inconsistencies.forEach((issue, index) => {
        console.log(`\n${index + 1}. [${issue.severity.toUpperCase()}] ${issue.type}`);
        console.log(`   Book: ${issue.book}`);
        console.log(`   Chapter: ${issue.chapter}`);
        console.log(`   Character: ${issue.character}`);
        console.log(`   Issue: ${issue.issue}`);
        console.log(`   Suggestion: ${issue.suggestion}`);
      });
    } else {
      console.log('\n✅ No inconsistencies found!');
    }
  } else {
    console.log('International Hearts directory not found');
  }
}

