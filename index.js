const express = require("express");
const app = express();

const db = require('./db')

app.get('/', async (req, res) => {
    const { commodity, district, market, date } = req.query;

    try {
        const [rows] = await db.query('SELECT * FROM prices WHERE commodity = ? AND district = ? AND market = ? AND date = ?', [commodity, district, market, date]);
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
        app.listen(8000, () => {
            console.log("Server started at Port 8000");
        });
    })
    .catch((err) => console.log(`DB connection failed ${err}`));