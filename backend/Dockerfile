# Använd en Node.js 18-bild
FROM node:18

# Ange arbetskatalog
WORKDIR /backend

# Kopiera package.json och installera beroenden
COPY package*.json ./
RUN npm install

# Kopiera hela projektet till arbetskatalogen i containern
COPY . .

# Exponera porten som applikationen kör på
EXPOSE 1337

# Standardkommando för att starta applikationen
CMD ["npm", "start"]


# FROM node:18

# COPY package*.json ./

# VOLUME /backend

# WORKDIR /backend

# EXPOSE 1337

# RUN ["npm", "install"]

# RUN ["npm", "test"]

# CMD ["node", "app.js"]
