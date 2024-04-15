const axios = require('axios');
const { parse, format } = require('date-fns');
const db = require('./db');

const url = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001a1976701d7c147736afd9ff243608d48&format=json&limit=100000';

axios.get(url)
  .then(response => {
    const data = response.data;
    data.records.forEach(async record => {
      const district = record.district;
      const market = record.market;
      const commodity = record.commodity;
      const variety = record.variety;
      const grade = record.grade;
      const minPrice = record.min_price;
      const maxPrice = record.max_price;
      const modalPrice = record.modal_price;
      
      const dateStr = record.arrival_date;
      const date = format(parse(dateStr, 'dd/MM/yyyy', new Date()), 'dd MMM yyyy');

      const formattedDate = format(new Date(date), 'yyyy-MM-dd HH:mm:ss');

      try {
        // Check if a record with the same fields already exists
        const existingRecord = await db.query('SELECT * FROM prices WHERE district = ? AND market = ? AND commodity = ? AND variety = ? AND grade = ? AND minPrice = ? AND maxPrice = ? AND modalPrice = ? AND date = ? AND formattedDate = ?', [district, market, commodity, variety, grade, minPrice, maxPrice, modalPrice, date, formattedDate]);

        if (existingRecord.length === 0) {
          // Insert only if no existing record found
          const sql = `
            INSERT INTO prices (district, market, commodity, variety, grade, minPrice, maxPrice, modalPrice, date, formattedDate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          await db.query(sql, [district, market, commodity, variety, grade, minPrice, maxPrice, modalPrice, date, formattedDate]);
          console.log('Data saved to database:', district, market, commodity, variety, grade, minPrice, maxPrice, modalPrice, date, formattedDate);
        } else {
          console.log('Data already exists for:', district, market, commodity, variety, grade, minPrice, maxPrice, modalPrice, date, formattedDate);
        }
      } catch (error) {
        console.error('Error saving data to database:', error);
      }
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
