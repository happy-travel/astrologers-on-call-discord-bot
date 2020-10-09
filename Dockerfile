FROM node:14-alpine

WORKDIR /app

RUN chown -R node:node /app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "index.js" ]