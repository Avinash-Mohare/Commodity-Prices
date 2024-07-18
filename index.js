const express = require("express");
const cors = require('cors');
const app = express();
const moment = require('moment');
const db = require('./db');
const {commodityMain} = require("./utils/mainCommodities");
const {states} = require("./utils/commodities");
const port = 8811
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    preflightContinue: true,
    optionsSuccessStatus: 204
};

// Use the CORS middleware with the configured options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
app.get('/', async (req, res) => {
    const { commodity, district, market, date,state } = req.query;
if (!state){
    let state_arr = [];
    res.status(200).json(states);
}
if (!commodity){
    let commodity_arr = [];
    return res.status(200).json(commodityMain);
}
 if (!commodity || !district  || !date) {
        return res.status(400).json({ error: 'Missing required query parameters' });
    }
const formattedDate = moment(date, 'DD MMM YYYY')
    .subtract(1, 'days') // Subtract one day
    .set({ hour: 18, minute: 30, second: 0 }) // Set time to 18:30:00
    .toISOString();
    console.log(formattedDate);
    try {
        const query = "SELECT p1.* FROM prices p1 JOIN (SELECT market, MAX(formatteddate) AS max_date FROM prices WHERE commodity = ? AND formatteddate <= ? AND district = ? GROUP BY market) p2 ON p1.market = p2.market AND p1.formatteddate = p2.max_date WHERE p1.commodity = ? AND p1.district = ? ORDER BY p1.formatteddate DESC";
        const params = [commodity, formattedDate,district, commodity, district];
	    console.log(query,params);
        const [rows,fields] = await db.query(query, params);
        console.log(rows);
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
            console.log("Server started at Port ",port);
        });
    })
    .catch((err) => console.log(`DB connection failed ${err}`));
