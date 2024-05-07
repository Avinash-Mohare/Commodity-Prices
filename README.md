Creating a db 

1. create database commodities;
2. CREATE TABLE prices (
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
    formattedDate TIMESTAMP
);
3. use commodities;

Using the API 

1. run the server using
   node fetchDailyData.js

2. make a get call to the endpoint
   /fetch-data/?date=15-Apr-2024
   date should be today's date

There is a utils folder which contains the name of the commodity and its code which is used to create a url to fetch data from the agmarknet

