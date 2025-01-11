FROM node:17-alpine

WORKDIR /usr/app

COPY ./frontend .


RUN npm install -g serve

RUN npm install

RUN if [ "$NODE_ENV" = "prod" ]; then npm install -g serve; fi

