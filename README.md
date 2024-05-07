Utils folder contains a file named "mainCommodities.js" it has the name of the commodity and its code which is used to create a url to fetch data from the agmarknet on daily basis

Creating a db 

1. ```sql
   create database commodities;
   ```
   
3. ```sql
   CREATE TABLE prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(255),
    market VARCHAR(255),
    commodity VARCHAR(255),
    variety VARCHAR(255),
    grade VARCHAR(255),
    minPrice VARCHAR(255),
    maxPrice VARCHAR(255),
    modalPrice VARCHAR(255),
    date VARCHAR(255),
    formattedDate TIMESTAMP);
   ```

3. ```sql
   use commodities;
   ```

Using the API 

1. run the server using
   ```bash
   node fetchDailyData.js
   ```

3. make a get call to the endpoint (date should be today's date)
   ```bash
   /fetch-data/?date=15-Apr-2024
   ```
   



