FROM node:18-alpine

COPY package*.json ./

# VOLUME /app

WORKDIR /app

RUN npm install --production --silent

COPY . .

# Build production bundle
RUN npm run build

# Expose port
EXPOSE 3000

# Run the production build
CMD ["npm", "run", "start"]

# Run the dev build
# CMD ["npm", "run", "dev"] 

