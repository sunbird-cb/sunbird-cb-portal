FROM node:12

WORKDIR /usr/src/app

COPY . .
RUN apt update && apt install -y zip
RUN apk add --update --no-cache \
  make \
  g++ \
  automake \
  autoconf \
  libtool \
  nasm \
  libjpeg-turbo-dev
RUN npm install jpegtran-bin
RUN npm install && npm run build

RUN zip -r dist.zip dist
