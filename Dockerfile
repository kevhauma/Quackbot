FROM node:17-alpine
WORKDIR /app
COPY ./package.json /app/
COPY ./package-lock.json /app/
RUN yarn install
COPY . /app
RUN cd /app
RUN yarn start