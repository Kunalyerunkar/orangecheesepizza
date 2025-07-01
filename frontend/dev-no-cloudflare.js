/**
 * Custom development server script
 * Run with: node dev-no-cloudflare.js
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Detect platform for correct command
const isWindows = os.platform() === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Set environment variables
const env = {
   ...process.env,
   NODE_ENV: 'development',
};

console.log('Starting development server...');

// Spawn dev server
const devProcess = spawn(npmCmd, ['run', 'dev'], {
   env,
   stdio: 'inherit',
   shell: true
});

// Handle process events
devProcess.on('error', (error) => {
   console.error('Failed to start development server:', error);
});

process.on('SIGINT', () => {
   console.log('Shutting down development server...');
   devProcess.kill('SIGINT');
   process.exit(0);
}); 