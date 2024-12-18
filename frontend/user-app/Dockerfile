FROM node:18

COPY package*.json ./

VOLUME /user-app

WORKDIR /user-app

EXPOSE 8081

RUN ["npm", "install"]

RUN ["npm", "install", "--global", "@expo/ngrok@^4.1.0"]

# Freeze on startup
# CMD ["tail", "-f", "/dev/null"]

CMD ["npx", "expo", "start", "-c", "--tunnel"]
