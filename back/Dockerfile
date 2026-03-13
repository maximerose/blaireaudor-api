FROM php:8.4-cli-alpine
RUN apk add --no-cache \
    git \
    unzip \
    postgresql-dev
RUN docker-php-ext-install pdo_pgsql
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /app
EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]