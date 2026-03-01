FROM node:22-alpine

WORKDIR /app

# On copie les fichiers de définition des paquets
COPY package.json package-lock.json ./

# On installe les dépendances (cela crée le dossier node_modules interne)
RUN npm install

# On expose le port
EXPOSE 5173

# On lance le serveur
CMD ["npm", "run", "dev", "--", "--host"]