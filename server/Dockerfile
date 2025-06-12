FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmmirror.com/
RUN npm ci
COPY . .

EXPOSE 8080
CMD ["npm", "start"]