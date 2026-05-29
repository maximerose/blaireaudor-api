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

COPY . .

ENV COMPOSER_ALLOW_SUPERUSER=1
ENV APP_ENV=prod

ENV DATABASE_URL=postgresql://dummy:dummy@127.0.0.1:5432/dummy?serverVersion=16&charset=utf8
ENV APP_SECRET=7b8ad9ebbfa79f8be316a7d63237778
ENV JWT_SECRET_KEY=dummy
ENV JWT_PUBLIC_KEY=dummy
ENV JWT_PASSPHRASE=dummy
ENV MERCURE_JWT_SECRET=dummy
ENV VAPID_SUBJECT=mailto:dummy@dummy.com
ENV VAPID_PUBLIC_KEY=dummy
ENV VAPID_PRIVATE_KEY=dummy
ENV DEFAULT_URI=http://localhost

RUN composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]