#!/usr/bin/env node

/**
 * Production Sync Script
 * Ensures all PDFs and story files are current with source material
 * Run this after making any edits to book chapters
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Syncing Production Files...\n');

// Run auto-update
try {
  execSync('node scripts/auto-update-production.js', { stdio: 'inherit' });
  console.log('\n✅ Production sync complete!');
} catch (error) {
  console.error('\n❌ Sync failed:', error.message);
  process.exit(1);
}

