console.log('Starting code-push-server...');

const { execSync } = require('child_process');

// Check for required dependencies
const missingDeps = [];
const requiredDeps = [
  'express', 
  'semver', 
  'body-parser', 
  'cookie-parser', 
  'morgan', 
  'request',
  'stream-to-array' // Added the missing dependency
];

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
    execSync(`npm install --no-save ${missingDeps.join(' ')}`);
    console.log('Dependencies installed successfully');
  } catch (error) {
    console.error('Error installing dependencies:', error);
  }
}

// Start the main server script
try {
  require('./bin/script/server');
} catch (error) {
  console.error('Error starting server:', error);
  process.exit(1);
}
