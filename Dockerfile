FROM node:18.19.1
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install pm2 -g
EXPOSE 8811
CMD ["pm2-runtime", "start", "pm2.config.js"]

# Set NODE_ENV environment variable
ENV NODE_ENV=production
