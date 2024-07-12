const express = require("express");
const app = express();
const moment = require('moment');
const db = require('./db')
const port = 8811
app.get('/', async (req, res) => {
    const { commodity, district, market, date } = req.query;

//    try {
//        const [rows] = await db.query('SELECT * FROM prices WHERE commodity = ? AND district = ? AND market = ? AND date = ?', [commodity, district, market, date]);
//        res.json(rows);
//    } catch (error) {
//        console.error('Error fetching data:', error);
 //       res.status(500).json({ error: 'Internal Server Error' });
//    }
 if (!commodity || !district || !market || !date) {
        return res.status(400).json({ error: 'Missing required query parameters' });
    }
const formattedDate = moment(date, 'DD MMM YYYY')
    .subtract(1, 'days') // Subtract one day
    .set({ hour: 18, minute: 30, second: 0 }) // Set time to 18:30:00
    .toISOString(); 
    console.log(formattedDate);
    try {
        const query = 'SELECT * FROM prices WHERE commodity = $1 AND district = $2 AND market = $3 AND formatteddate <= $4 ORDER BY formatteddate DESC limit 1';
        const params = [commodity, district, market, formattedDate];
        const { rows } = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    // console.log(req.query);
    // res.send('Received query parameters');
});

db.query("SELECT 1")
    .then(() => {
        console.log("DB Connection successful");
        app.listen(port, () => {
            console.log("Server started at Port 8000");
        });
    })
    .catch((err) => console.log(`DB connection failed ${err}`));
