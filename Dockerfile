FROM node:17-alpine
WORKDIR /app
COPY . /app
RUN ls -l
RUN yarn install
RUN cd /app
RUN ls -l
RUN yarn start