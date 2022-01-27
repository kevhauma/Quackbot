FROM node:17-alpine
WORKDIR /app
RUN mv ./.env.production ./.env
COPY . /app
RUN yarn install
RUN cd /app
RUN yarn start