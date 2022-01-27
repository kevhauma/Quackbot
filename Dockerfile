FROM node:17-alpine
WORKDIR /
RUN yarn install
RUN ls
RUN yarn start