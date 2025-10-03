FROM node:alpine

WORKDIR /egertonfront

COPY package.json .
COPY . .

RUN npm install

CMD ["npm", "start"]
