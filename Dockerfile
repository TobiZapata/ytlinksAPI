FROM node:22@sha256:35a5dd72bcac4bce43266408b58a02be6ff0b6098ffa6f5435aeea980a8951d7

# Configure default locale and user
ENV LANG=en_US.UTF-8 \
    PPTRUSER_UID=10042

# Install necessary dependencies for Chrome and Puppeteer
RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-khmeros \
    fonts-kacst \
    fonts-freefont-ttf \
    dbus \
    dbus-x11 \
    libx11-dev \
    libnss3 \
    libxkbcommon0 \
    libgdk-pixbuf2.0-0 \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libxcomposite1 \
    libxrandr2 \
    libgbm1 \
    libpango1.0-0 \
    libpangocairo-1.0-0 \
    libatk-bridge2.0-0 \
    libnspr4 \
    libnsuse1 \
    --no-install-recommends

# Add non-root user
RUN groupadd -r pptruser && useradd -u $PPTRUSER_UID -rm -g pptruser -G audio,video pptruser

USER $PPTRUSER_UID

WORKDIR /home/pptruser

# Install Puppeteer dependencies
RUN npm init -y \
    && npm install puppeteer --save

# Install system dependencies (to run Chrome)
USER root
RUN PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer \
    npx puppeteer browsers install chrome --install-deps

# Switch back to non-root user
USER $PPTRUSER_UID

# Expose port (if necessary)
EXPOSE 4000

CMD ["node", "index.js"]
