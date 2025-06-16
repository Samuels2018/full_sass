FROM php:8.4-cli

WORKDIR /var/www/html

# Instala dependencias del sistema y PHP
RUN apt-get update && \
  apt-get install -y libpq-dev git unzip && \
  docker-php-ext-install pdo pdo_pgsql && \
  curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copia el código y configura
COPY . .
RUN composer install

# Permite usar artisan desde fuera del contenedor
ENTRYPOINT ["php", "artisan"]
CMD ["serve", "--host=0.0.0.0", "--port=8000"]