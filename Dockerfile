FROM node:18

# Configuración de ambiente
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Instalación de dependencias necesarias para Chrome
RUN apt-get update && apt-get install -y --no-install-recommends \
  libnss3 \
  libatk-bridge2.0-0 \
  libxkbcommon0 \
  libatk1.0-0 \
  libcups2 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libpango1.0-0 \
  libcairo2 \
  libasound2 \
  libxshmfence1 \
  fonts-liberation \
  libnss3 \
  lsb-release \
  wget \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Instalar Google Chrome Stable
RUN apt-get update && apt-get install -y google-chrome-stable --no-install-recommends

# Configuración de usuario no root
RUN groupadd -r pptruser && useradd -rm -g pptruser -G audio,video pptruser
USER pptruser

# Configuración del directorio de trabajo
WORKDIR /home/pptruser/app

# Copiar y preparar la aplicación
COPY package*.json ./
RUN npm ci
COPY . .

# Iniciar la aplicación
CMD ["node", "index.js"]
