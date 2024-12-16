# Docker commands wile in dir admin-web
# docker build -t admin-webpage .
# docker run -p 3000:3000 admin-webpage

FROM node:18-alpine

VOLUME /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"] 
# CMD ["npm", "run", "start"]

