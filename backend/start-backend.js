const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define paths to the Strapi and Stripe server directories and .env files
const strapiPath = path.join(__dirname, 'strapi-server');
const strapiEnvPath = path.join(strapiPath, '.env');
const stripeServerPath = path.join(__dirname, 'stripe-server', 'stripe-server.js');
const stripeEnvPath = path.join(__dirname, 'stripe-server', '.env');

// Function to load environment variables from a specific .env file
function loadEnv(envPath) {
  if (fs.existsSync(envPath)) {
    const dotenv = require('dotenv');
    const parsedEnv = dotenv.parse(fs.readFileSync(envPath));
    return { ...process.env, ...parsedEnv };
  }
  return process.env;
}

// Start the Strapi server
const strapiProcess = spawn('npx', ['strapi', 'develop'], {
  cwd: strapiPath, // Set the current working directory to strapiPath
  stdio: 'inherit', // Inherit the stdout, stderr, and stdin of the parent process
  env: loadEnv(strapiEnvPath), // Load environment variables for Strapi
});

// Handle Strapi process errors
strapiProcess.on('error', (err) => {
  console.error(`Error starting Strapi server: ${err.message}`);
});

// Start the Stripe server
const stripeProcess = spawn('node', [stripeServerPath], {
  stdio: 'inherit', // Inherit the stdout, stderr, and stdin of the parent process
  env: { ...process.env, PORT: '4242' }, // Ensure Stripe server uses port 4242
});

// Handle Stripe process errors
stripeProcess.on('error', (err) => {
  console.error(`Error starting Stripe server: ${err.message}`);
});
