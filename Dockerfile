FROM node:17-alpine
WORKDIR /app
COPY . /app
RUN cd /app
RUN yarn install
RUN ls -a
RUN cat ./.env
CMD yarn start
