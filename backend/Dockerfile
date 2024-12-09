FROM node:18

COPY package*.json ./

VOLUME /backend

WORKDIR /backend

EXPOSE 1337

RUN ["npm", "install"]

CMD ["node", "app.js"]
