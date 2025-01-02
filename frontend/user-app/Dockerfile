# Docker commands wile in dir admin-web
# docker build -t admin-webpage .
# docker run -p 3000:3000 admin-webpage

FROM node:18-alpine

WORKDIR /user-app

COPY package*.json ./

RUN npm install

COPY . .

VOLUME /user-app


EXPOSE 3000

CMD ["npm", "run", "dev"]
# CMD ["npm", "run", "start"]
