FROM node:14-alpine

WORKDIR /app

RUN chown -R node:node /app

COPY package*.json ./

ARG HTDC_ON_CALL_DISCORD_TOKEN

ENV HTDC_ON_CALL_DISCORD_TOKEN=$HTDC_ON_CALL_DISCORD_TOKEN

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "index.js" ]