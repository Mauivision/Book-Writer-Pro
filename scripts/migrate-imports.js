#!/usr/bin/env node

/**
 * Migration script to update import statements after refactoring
 * Usage: node scripts/migrate-imports.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Migration mappings
const importMappings = {
  // Store imports
  "@/store/useBookStore": "@/store/bookStore",
  
  // Type imports (if still using old paths)
  "@/types/writing": "@/types",
  
  // API imports
  "@/utils/api": "@/utils/apiClient",
};

// File patterns to process
const filePatterns = [
  'src/**/*.{ts,tsx,js,jsx}',
  '!src/store/useBookStore.ts', // Skip the old store file
  '!node_modules/**',
  '!dist/**',
  '!build/**',
];

function updateImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Update import statements
    for (const [oldImport, newImport] of Object.entries(importMappings)) {
      const importRegex = new RegExp(`from\\s+['"]${oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
      if (importRegex.test(content)) {
        content = content.replace(importRegex, `from '${newImport}'`);
        hasChanges = true;
        console.log(`Updated import in ${filePath}: ${oldImport} -> ${newImport}`);
      }
    }

    // Write back if changes were made
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('Starting import migration...\n');

  let totalFiles = 0;
  let updatedFiles = 0;

  // Process each file pattern
  filePatterns.forEach(pattern => {
    const files = glob.sync(pattern, { ignore: ['node_modules/**', 'dist/**', 'build/**'] });
    
    files.forEach(file => {
      totalFiles++;
      if (updateImports(file)) {
        updatedFiles++;
      }
    });
  });

  console.log(`\nMigration complete!`);
  console.log(`Total files processed: ${totalFiles}`);
  console.log(`Files updated: ${updatedFiles}`);
  
  if (updatedFiles > 0) {
    console.log('\nNext steps:');
    console.log('1. Run "npm run lint" to check for any remaining issues');
    console.log('2. Run "npm run test" to ensure all tests pass');
    console.log('3. Test the application manually to ensure everything works');
  }
}

// Run the migration
if (require.main === module) {
  main();
}

module.exports = { updateImports, importMappings }; 