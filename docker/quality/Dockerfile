FROM node:22-alpine
RUN npm install -g npm@11.11.0
RUN npm install -g prettier husky
WORKDIR /app
COPY package.json package-lock.json
RUN npm install
COPY . .