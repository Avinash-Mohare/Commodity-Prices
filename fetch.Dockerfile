FROM node:18.19.1
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
#COPY db ./db
#COPY fetchDailyData.js .
EXPOSE 8810
CMD ["node", "fetchDailyData.js"]
