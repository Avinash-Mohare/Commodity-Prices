const mysql = require('mysql2/promise');

// Create a pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '122123',
    database: 'commodities',
});

// Export the pool
module.exports = pool;
