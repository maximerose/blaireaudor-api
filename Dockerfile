FROM php:8.4-cli-alpine

# Installation des dépendances système et du driver PostgreSQL
RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo_pgsql

# Installation de Composer (pour les commandes sf)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app