FROM php:8.4-cli-alpine

# Installation des dépendances
RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo_pgsql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# On expose le port 8000 pour Symfony
EXPOSE 8000

# Commande pour lancer le serveur local de Symfony
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]