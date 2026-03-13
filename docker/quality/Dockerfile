FROM node:22-alpine
RUN npm install -g npm@11.11.0
RUN npm install -g eslint @eslint/js globals typescript-eslint eslint-plugin-react @eslint/json @eslint/markdown @eslint/css prettier husky
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .