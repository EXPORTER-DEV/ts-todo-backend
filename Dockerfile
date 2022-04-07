FROM node:17
WORKDIR /usr/src/app
COPY package*.json ormconfig.js .
COPY ./src ./src
RUN npm ci --only=production
CMD [ "npm", "run", "build" ]
CMD [ "npm", "run", "start:prod" ]