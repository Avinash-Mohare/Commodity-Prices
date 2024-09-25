const mysql = require('mysql2/promise');
//// Set up your connection details
//#const pool = mysql.createPool({#/    user: 'price',/
//#    host: 'localhost',
//##    database: 'commodities',
//    password: 'password',
//    port: 5432, // Default port for PostgreSQL
//});
const pool = mysql.createPool({
    host: 'asqiresdb2.c94g6o8m0thc.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    database: 'commodities',
    password: 'Adm!n321',
    port: 3306, // Default port for MySQL
});
// Function to check the connection
async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('DB Connection successful');
        connection.release();
    } catch (err) {
        console.error('DB Connection failed:', err.message);
    }
}

// Check the connection
checkConnection();

// Export the pool
module.exports = pool;
