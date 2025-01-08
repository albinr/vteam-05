# Docker commands wile in dir admin-web
# docker build -t admin-webpage .
# docker run -p 3000:3000 admin-webpage

FROM node:18-alpine

COPY package*.json ./

VOLUME /app

WORKDIR /app

RUN npm install

COPY . .

# RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "dev"] 
# CMD ["npm", "run", "start"]

