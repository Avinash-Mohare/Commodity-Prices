const express = require('express');
const axios = require("axios");
const cheerio = require("cheerio");
const {commodityMain} = require("./utils/mainCommodities");
const {parse, format} = require('date-fns');
const db = require("./db");
const app = express();
const port = 3000;

//Functions 
function createUrl(commodityName, commodityValue, date){
    const params = new URLSearchParams({
        Tx_Commodity: commodityValue,
        Tx_State: 0,
        Tx_District: 0,
        Tx_Market: 0,
        DateFrom: date,
        DateTo: date,
        Fr_Date: date,
        To_Date: date,
        Tx_Trend: 0,
        Tx_CommodityHead: encodeURIComponent(commodityName),
        Tx_StateHead: "--Select--",
        Tx_DistrictHead: "--Select--",
        Tx_MarketHead: "--Select--",
    })

    const baseUrl = "https://agmarknet.gov.in/SearchCmmMkt.aspx";

    return `${baseUrl}?${params.toString()}`;
}

async function fetchData(url) {
    // console.log(url);
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const tableRows = $("table.tableagmark_new tbody tr");
        tableRows.each((index, element) => {
            const columns = $(element).find("td");
            const district = $(columns[1]).text().trim();
            const market = $(columns[2]).text().trim();
            const commodity = $(columns[3]).text().trim();
            const variety = $(columns[4]).text().trim();
            const grade = $(columns[5]).text().trim();
            const minPrice = $(columns[6]).text().trim();
            const maxPrice = $(columns[7]).text().trim();
            const modalPrice = $(columns[8]).text().trim();
            const date = $(columns[9]).text().trim();

            // Check if the row contains "No Data Found" or an empty row
            if (columns.length === 0 || (columns.length === 1 && $(columns[0]).attr('colspan') === '12')) {
                console.log("Skipping empty row or 'No Data Found' row");
            }
            else{
                try {
                    const formattedDate = format(parse(date, 'dd MMM yyyy', new Date()), 'yyyy-MM-dd HH:mm:ss');
                    const sql = `
                        INSERT INTO prices (district, market, commodity, variety, grade, minPrice, maxPrice, modalPrice, date, formattedDate)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    db.query(sql, [district, market, commodity, variety, grade, minPrice, maxPrice, modalPrice, date, formattedDate]);
                    console.log('Data saved to database:', district, market, commodity, variety, grade, minPrice, maxPrice, modalPrice, date, formattedDate);
                } catch (error) {
                    console.error('Error saving data to database:', error);
                }
            }
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function fetchDataWithDelay(url, delay) {
    return new Promise((resolve) => {
      setTimeout(() => {
        fetchData(url);
        resolve();
        
      }, delay);
    });
  }

async function fetchDataForCommodities(commoditySet, date) {
for (const [commodity, commodityCode] of Object.entries(commoditySet)) {
        const url = createUrl(commodity, commodityCode, date);
        await fetchDataWithDelay(url, 100);
    }
}


app.get('/fetch-data', async (req, res) => {
  try {
    const {date} = req.query
    if (!date) {
        return res.status(400).send('Date is required');
    }

    await fetchDataForCommodities(commodityMain, date);
    res.send('Data fetch completed');
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
