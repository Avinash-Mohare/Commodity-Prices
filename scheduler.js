const cron = require('node-cron');
const axios = require('axios');
const moment = require('moment');

// Schedule a task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running a task every midnight');
    
    // Calculate yesterday's date
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    console.log(`Fetching data for date: ${yesterday}`);

    try {
        const response = await axios.get(`http://localhost:8810/fetch-data?date=${yesterday}`);
        console.log(`Data fetch completed: ${response.data}`);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
});

console.log('Scheduler started');
