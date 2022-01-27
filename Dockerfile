FROM node:17-alpine
WORKDIR /app
COPY . /app
RUN ls
RUN yarn install
RUN cd /app
RUN ls
RUN yarn start