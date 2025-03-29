console.log('Starting code-push-server...');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check for required dependencies
const missingDeps = [];
const requiredDeps = [
  'express', 
  'semver', 
  'body-parser', 
  'cookie-parser', 
  'morgan', 
  'request',
  'stream-to-array',
  '@azure/data-tables',
  '@azure/identity',
  '@azure/keyvault-secrets',
  '@azure/storage-blob',
  '@azure/storage-queue',
  'applicationinsights',
  'cookie-session',
  'ejs',
  'email-validator',
  'express-domain-middleware',
  'express-rate-limit',
  'multer',
  'node-deepcopy',
  'passport',
  'passport-azure-ad',
  'passport-github2',
  'passport-http-bearer',
  'passport-windowslive',
  'q',
  'redis',
  'sanitize-html',
  'shortid',
  'streamifier',
  'superagent',
  'try-json',
  'yauzl',
  'yazl'
];

// Special handling for semver which has a known issue
const semverPath = path.join(__dirname, 'node_modules', 'semver');
const semverFunctionsPath = path.join(semverPath, 'functions');
if (!fs.existsSync(path.join(semverFunctionsPath, 'valid.js'))) {
  console.log('Semver module is missing required files. Reinstalling specific version...');
  try {
    // Remove the existing semver module if it exists
    if (fs.existsSync(semverPath)) {
      execSync('rm -rf ' + semverPath, { stdio: 'inherit' });
    }
    // Install a specific version of semver known to work
    execSync('npm install --no-save semver@7.3.8', { stdio: 'inherit' });
    console.log('Semver reinstalled successfully');
  } catch (error) {
    console.error('Failed to reinstall semver:', error);
  }
}

for (const dep of requiredDeps) {
  try {
    require.resolve(dep);
    console.log(`${dep} module found`);
  } catch (e) {
    console.log(`${dep} module not found, will install`);
    missingDeps.push(dep);
  }
}

// Install any missing dependencies
if (missingDeps.length > 0) {
  try {
    console.log(`Installing missing dependencies: ${missingDeps.join(', ')}`);
    try {
      // Use --no-save to avoid modifying package.json
      // Use --no-fund to reduce output noise
      // Use --no-audit to speed up installation
      execSync(`npm install --no-save --no-fund --no-audit ${missingDeps.join(' ')}`, { stdio: 'inherit' });
      console.log('Dependencies installed successfully');
    } catch (npmError) {
      console.error('Error installing dependencies with npm:', npmError);
      console.log('Attempting to use pre-installed modules...');
    }
  } catch (error) {
    console.error('Error handling dependencies:', error);
    // Continue anyway - the app might still work if the modules are in node_modules
  }
}

// Start the main server script
try {
  require('./bin/script/server');
} catch (error) {
  console.error('Error starting server:', error);
  // Log more details about the error
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error('Module not found details:', error.requireStack);
  }
  process.exit(1);
}
