# Usa la imagen oficial de Puppeteer
FROM ghcr.io/puppeteer/puppeteer:23.10.4

# Configuración del entorno
WORKDIR /usr/src/app

# Copia los archivos del proyecto
COPY package*.json ./
RUN npm ci
COPY . .

# Asegura que Puppeteer funcione correctamente
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NODE_ENV=production

# Comando para correr la app
CMD ["node", "index.js"]
