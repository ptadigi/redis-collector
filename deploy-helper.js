#!/usr/bin/env node

/**
 * Redis Collector Node - Cross-platform deployment helper
 * Automatically detects OS and runs appropriate deployment script
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function log(message) {
  console.log(`🚀 ${message}`);
}

function error(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function success(message) {
  console.log(`✅ ${message}`);
}

function main() {
  log('Redis Collector Node - Auto Deployment');
  
  // Check if we're in the right directory
  if (!fs.existsSync('package.json') || !fs.existsSync('src/nodes/RedisCollector/RedisCollector.node.ts')) {
    error('Please run this script from the gomtin project root directory');
  }
  
  // Check if build exists
  if (!fs.existsSync('dist')) {
    error('Build not found. Please run "npm run build" first');
  }
  
  const platform = os.platform();
  const n8nHome = process.env.N8N_HOME || path.join(os.homedir(), '.n8n');
  const customDir = path.join(n8nHome, 'custom');
  const nodeDir = path.join(customDir, 'n8n-nodes-redis-collector');
  
  log(`Platform: ${platform}`);
  log(`N8N Home: ${n8nHome}`);
  log(`Target Directory: ${nodeDir}`);
  
  try {
    // Create custom directory if it doesn't exist
    if (!fs.existsSync(customDir)) {
      fs.mkdirSync(customDir, { recursive: true });
      log('Created custom nodes directory');
    }
    
    // Remove existing installation
    if (fs.existsSync(nodeDir)) {
      fs.rmSync(nodeDir, { recursive: true, force: true });
      log('Removed existing installation');
    }
    
    // Copy dist directory
    copyDirectory('dist', nodeDir);
    log('Copied built files');
    
    // Copy package.json
    fs.copyFileSync('package.json', path.join(nodeDir, 'package.json'));
    log('Copied package.json');
    
    success('Redis Collector Node deployed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Restart n8n if it\'s running');
    console.log('   2. Open n8n web interface');
    console.log('   3. Look for "Redis Collector" in the nodes panel');
    console.log('');
    console.log('🔧 Environment variable (optional):');
    console.log(`   export N8N_CUSTOM_EXTENSIONS="${customDir}"`);
    
  } catch (err) {
    error(`Deployment failed: ${err.message}`);
  }
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };