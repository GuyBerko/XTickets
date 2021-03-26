# FROM node:alpine
FROM node:14.15.5-alpine3.10

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]
