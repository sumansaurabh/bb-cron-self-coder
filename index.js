const cron = require('node-cron');
const axios = require('axios');

// Placeholder API endpoint - replace with your actual endpoint
const API_ENDPOINT = process.env.API_ENDPOINT || 'https://api.example.com/endpoint';

/**
 * Determines the frequency based on the current hour.
 *
 * The function checks the input hour against a series of divisibility conditions in a specific priority order: 24, 12, 6, 4, 3, 2, and defaults to 1.
 * It returns a string representing the frequency based on the highest priority condition met.
 *
 * @param hour - The current hour as a number.
 * @returns A string indicating the frequency based on the input hour.
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
 * Calls the API with the appropriate frequency parameter.
 *
 * This function retrieves the current hour and determines the frequency using the getFrequency function.
 * It then makes an API call to the specified API_ENDPOINT with the frequency as a query parameter.
 * The function handles both successful responses and errors, logging relevant information to the console.
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

// Schedule the job to run at the start of every hour
cron.schedule('0 * * * *', () => {
  console.log('Cron job triggered');
  callAPI();
});

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
