FROM node:17-alpine
WORKDIR /app
COPY ./package.json /app/
COPY ./yarn.lock /app/
COPY ./.env.production /app/
RUN yarn install
COPY . /app
RUN cd /app
RUN yarn start