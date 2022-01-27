FROM node:12-alpine as build
WORKDIR /app
COPY ./package.json /app/
COPY ./package-lock.json /app/
RUN npm ci
COPY . /app
RUN cd /app
RUN npm run start