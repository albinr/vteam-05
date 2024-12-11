# Docker commands
# docker build -t admin-webpage .
# docker run -p 3000:3000 admin-webpage

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# CMD ["npm", "run", "dev"] # For development
CMD ["npm", "run", "start"]

