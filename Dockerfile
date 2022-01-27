FROM node:17-alpine
WORKDIR /app
COPY . /app
RUN ls -a
RUN yarn install
RUN cd /app
RUN ls -a
RUN yarn start