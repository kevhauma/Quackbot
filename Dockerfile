FROM node:17-alpine
WORKDIR /app
COPY . /app
RUN cd /app
RUN yarn install
RUN ls -a
RUN ls -a ./node_modules
RUN cat ./.env
RUN yarn start
