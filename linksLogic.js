const puppeteer = require("puppeteer");
require("dotenv").config();

const linksLogic = async (channelLink) => {
  try {
    const URL = `${channelLink}/videos`;

    // Configurar Puppeteer con Chromium
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );
    await page.goto(URL, { waitUntil: "domcontentloaded" });

    // Realizar scroll para cargar todos los videos
    let previousHeight;
    while (true) {
      previousHeight = await page.evaluate(
        () => document.documentElement.scrollHeight
      );
      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight)
      );
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newHeight = await page.evaluate(
        () => document.documentElement.scrollHeight
      );
      if (newHeight === previousHeight) break;
    }

    // Extraer los links de los videos
    const videos = await page.evaluate(() => {
      const videoElements = Array.from(
        document.querySelectorAll(
          ".yt-simple-endpoint.style-scope.ytd-playlist-thumbnail"
        )
      );
      return videoElements.map((video) => ({ href: video.href }));
    });

    await browser.close();
    return videos; // Retornar los links
  } catch (error) {
    console.error("Error en linksLogic:", error);
    throw error;
  }
};

module.exports = linksLogic;
