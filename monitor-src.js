#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

console.log('🔍 Monitoring src directory for changes...');
console.log('📁 Watching:', srcDir);

if (!fs.existsSync(srcDir)) {
  console.error('❌ src directory does not exist!');
  process.exit(1);
}

fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
  const timestamp = new Date().toISOString();
  const filePath = path.join(srcDir, filename || '');
  
  if (eventType === 'rename') {
    if (fs.existsSync(filePath)) {
      console.log(`✅ [${timestamp}] File created: ${filename}`);
    } else {
      console.log(`🗑️  [${timestamp}] File deleted: ${filename}`);
      console.log('⚠️  File deletion detected! Check what process might have caused this.');
    }
  } else if (eventType === 'change') {
    console.log(`📝 [${timestamp}] File modified: ${filename}`);
  }
});

console.log('Press Ctrl+C to stop monitoring...');
