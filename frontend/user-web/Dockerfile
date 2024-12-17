# Docker commands wile in dir user-web
# docker build -t user-web .
# docker run -p 3001:3001 user-web

FROM node:18-alpine

VOLUME /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "dev"] 
# CMD ["npm", "run", "start"]

