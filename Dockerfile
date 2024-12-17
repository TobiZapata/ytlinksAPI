# Usar la base oficial de Puppeteer
FROM node:22@sha256:35a5dd72bcac4bce43266408b58a02be6ff0b6098ffa6f5435aeea980a8951d7

# Variables de entorno necesarias
ENV LANG=en_US.UTF-8 \
    DBUS_SESSION_BUS_ADDRESS=autolaunch: \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NODE_ENV=production

# Instalar dependencias del sistema requeridas por Puppeteer/Chrome
RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros \
    fonts-kacst fonts-freefont-ttf dbus dbus-x11 libnss3 libatk1.0-0 \
    libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 \
    libgconf-2-4 libasound2 libpangocairo-1.0-0 libxrandr2 \
    libcups2 libatk-bridge2.0-0 libgbm1 libxkbcommon0 xdg-utils ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Configurar un usuario no-root para seguridad
RUN groupadd -r pptruser && useradd -u 10042 -rm -g pptruser -G audio,video pptruser
USER pptruser

# Configurar el directorio de trabajo
WORKDIR /home/pptruser/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto donde corre tu aplicación
EXPOSE 4000

# Comando para ejecutar el servidor
CMD ["node", "index.js"]
