FROM node:18-alpine

COPY package*.json ./

VOLUME /app

WORKDIR /app

RUN npm install

COPY . .

# RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "dev"] 
# CMD ["npm", "run", "start"]

