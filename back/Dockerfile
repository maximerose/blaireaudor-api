FROM php:8.4-cli-alpine

# 1. On ajoute gmp-dev dans la liste des paquets Alpine
RUN apk add --no-cache \
    git \
    unzip \
    postgresql-dev \
    gmp-dev

# 2. On installe et active les extensions gmp et bcmath
RUN docker-php-ext-install pdo_pgsql gmp bcmath

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /app
EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]