FROM node:17-alpine
WORKDIR /app
COPY . /app
RUN cd /app
RUN yarn install
CMD yarn start
