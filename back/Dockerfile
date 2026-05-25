FROM php:8.4-cli-alpine

# 1. On ajoute gmp-dev et icu-dev (pour intl) dans la liste des paquets Alpine
RUN apk add --no-cache \
    git \
    unzip \
    postgresql-dev \
    gmp-dev \
    icu-dev

# 2. On configure et installe intl, pdo_pgsql, gmp et bcmath
RUN docker-php-ext-configure intl \
    && docker-php-ext-install pdo_pgsql gmp bcmath intl

# 3. On augmente la limite de mémoire par défaut de PHP (128M -> 512M)
RUN echo "memory_limit = 512M" > /usr/local/etc/php/conf.d/memory-limit.ini

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /app
EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]