console.log('Starting code-push-server...');

// Set environment variables to prevent common errors
process.env.REDIS_HOST = process.env.REDIS_HOST || "none";
process.env.DISABLE_REDIS = process.env.DISABLE_REDIS || "true";
process.env.HTTPS = process.env.HTTPS || "false";

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check for required dependencies - but don't install them
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

// Log which dependencies are found and which are missing, but don't install them
for (const dep of requiredDeps) {
  try {
    require.resolve(dep);
    console.log(`${dep} module found`);
  } catch (e) {
    console.log(`${dep} module not found, but continuing anyway`);
  }
}

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

// Start the main server script
try {
  require('./api/script/server');
} catch (error) {
  console.error('Error starting server:', error);
  // Log more details about the error
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error('Module not found details:', error.requireStack);
  }
  process.exit(1);
}
