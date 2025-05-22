FROM node:18-alpine3.18

WORKDIR /usr
COPY package.json ./
COPY yarn.lock ./
COPY client ./client
COPY config ./config
COPY sdk ./sdk
COPY server ./server

RUN apk add --update --no-cache libc6-compat
RUN apk add --update --no-cache \
  make \
  g++ \
  automake \
  autoconf \
  libtool \
  nasm \
  libjpeg-turbo-dev
RUN npm install
RUN npm run build

CMD [ "node", "./server/index.js" ]