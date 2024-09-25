const axios = require("axios");
const cheerio = require("cheerio");
const {commoditySet1} = require("../utils/commodities");

const db = require("../db");

function createUrl(commodityName, commodityValue){
    const params = new URLSearchParams({
        Tx_Commodity: commodityValue,
        Tx_State: 0,
        Tx_District: 0,
        Tx_Market: 0,
        DateFrom: "01-Jul-2024",
        DateTo: "10-Jul-2024",
        Fr_Date: "01-Jul-2024",
        To_Date: "10-Jul-2024",
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
                // Insert data into MySQL
                try {
                    const sql = `
                        INSERT INTO prices (district, market, commodity, variety, grade, minPrice, maxPrice, modalPrice, date)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    db.query(sql, [district, market, commodity, variety, grade, minPrice, maxPrice, modalPrice, date]);
                    console.log('Data saved to database:', district, market, commodity, variety, grade, minPrice, maxPrice, modalPrice, date);
                } catch (error) {
                    console.error('Error saving data to database:', error);
                }
            }

            console.log(date);
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

  async function fetchDataForCommodities(commoditySet) {
    for (const [commodity, commodityCode] of Object.entries(commoditySet)) {
      const url = createUrl(commodity, commodityCode);
      await fetchDataWithDelay(url, 100);
    }
  }


  // Usage
  fetchDataForCommodities(commoditySet1);
  