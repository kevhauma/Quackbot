FROM node:17-alpine
WORKDIR /app
COPY . /app
RUN yarn install
RUN cd /app
RUN mv ./.env.production ./.env
RUN yarn start