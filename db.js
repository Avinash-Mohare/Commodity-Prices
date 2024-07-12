const { Pool } = require('pg');

// Set up your connection details
const pool = new Pool({
    user: 'price',
    host: 'localhost',
    database: 'commodities',
    password: 'password',
    port: 5432, // Default port for PostgreSQL
});


// Export the pool
module.exports = pool;
