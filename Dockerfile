FROM node:17-alpine
WORKDIR /app
COPY . /app
RUN yarn global add dotenv/config
RUN yarn install
RUN cd /app
RUN ls -a
RUN cat ./.env
CMD yarn start
