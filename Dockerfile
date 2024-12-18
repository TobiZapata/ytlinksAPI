# Usar una imagen base oficial de Node
FROM node:22

# Establecer el entorno de idioma
ENV LANG=en_US.UTF-8

# Actualizar los paquetes existentes y agregar el repositorio de Google Chrome
RUN apt-get update \
    && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    --no-install-recommends \
    && curl --silent --location https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list' \
    && apt-get update

# Ahora puedes instalar Google Chrome
RUN apt-get install -y google-chrome-stable --no-install-recommends

# Instalar dependencias necesarias para Puppeteer
RUN apt-get install -y \
    libnss3 \
    libxkbcommon0 \
    libx11-xcb1 \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libxss1 \
    libgbm1 \
    libgtk-3-0 \
    libdbus-1-3 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Crear un usuario no root
RUN groupadd -r pptruser && useradd -m -r -g pptruser pptruser

# Cambiar al usuario no root
USER pptruser

WORKDIR /home/pptruser

# Copiar los archivos de tu aplicación y las dependencias de Puppeteer
COPY --chown=pptruser:pptruser package*.json ./
RUN npm install

# Copiar el resto de los archivos de tu proyecto
COPY --chown=pptruser:pptruser . .

# Establecer el comando para iniciar tu aplicación
CMD ["node", "index.js"]
