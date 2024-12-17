# Usar la base oficial de Puppeteer
FROM node:22@sha256:35a5dd72bcac4bce43266408b58a02be6ff0b6098ffa6f5435aeea980a8951d7

# Variables de entorno necesarias para Puppeteer
ENV LANG=en_US.UTF-8 \
    DBUS_SESSION_BUS_ADDRESS=autolaunch: \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NODE_ENV=production

# Instalar dependencias del sistema necesarias para Puppeteer
RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros \
    fonts-kacst fonts-freefont-ttf dbus dbus-x11

# Configurar un usuario no-root para mayor seguridad
RUN groupadd -r pptruser && useradd -u 10042 -rm -g pptruser -G audio,video pptruser
USER pptruser

# Configurar el directorio de trabajo
WORKDIR /home/pptruser/app

# Copiar el package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de tu proyecto
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto donde corre tu aplicación
EXPOSE 4000

# Comando para ejecutar tu servidor
CMD ["node", "index.js"]
