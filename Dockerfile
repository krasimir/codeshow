FROM node:18-alpine

WORKDIR /usr
COPY package.json ./
COPY yarn.lock ./

RUN apk add --update --no-cache \
  make \
  g++ \
  automake \
  autoconf \
  libtool \
  nasm \
  libjpeg-turbo-dev
RUN yarn install

COPY client ./client
COPY server ./server
CMD [ "node", "./server/index.js" ]