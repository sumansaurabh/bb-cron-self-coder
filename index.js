const cron = require('node-cron');
const axios = require('axios');

// Placeholder API endpoint - replace with your actual endpoint
const API_ENDPOINT = process.env.API_ENDPOINT || 'https://cloud.blackbox.ai/api/cron/execute';

/**
 * Determines the frequency based on current hour
 * Priority order: 24, 12, 6, 4, 3, 2, 1
 */
function getFrequency(hour) {
  if (hour % 24 === 0) return '24x';
  if (hour % 12 === 0) return '12x';
  if (hour % 6 === 0) return '6x';
  if (hour % 4 === 0) return '4x';
  if (hour % 3 === 0) return '3x';
  if (hour % 2 === 0) return '2x';
  return '1x';
}

/**
 * Calls the API with the appropriate frequency parameter
 */
async function callAPI() {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const frequency = getFrequency(currentHour);
    
    console.log(`[${now.toISOString()}] Current hour: ${currentHour}, Frequency: ${frequency}`);
    
    const response = await axios.get(API_ENDPOINT, {
      params: {
        frequency: frequency
      },
      timeout: 30000
    });
    
    console.log(`[${now.toISOString()}] API call successful:`, response.status);
    console.log('Response data:', response.data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] API call failed:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Call immediately on startup for testing
console.log('Cron job scheduler started');
console.log('Job will run at the start of every hour (0 * * * *)');
console.log('Running initial API call...');
callAPI();

// Keep the process running
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
