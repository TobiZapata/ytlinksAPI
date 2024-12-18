const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium-min");

chromium.setHeadlessMode = true;

const linksLogic = async (channelLink) => {
  try {
    const URL = `${channelLink}/videos`;
    console.log(URL);
    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
    const browser = await puppeteer.launch({
      args: isLocal
        ? puppeteer.defaultArgs()
        : [
            ...chromium.args,
            "--hide-scrollbars",
            "--incognito",
            "--no-sandbox",
          ],
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ||
        (await chromium.executablePath(
          "https://tobiassets.s3.us-east-2.amazonaws.com/chromium-v131.0.1-pack.tar"
        )),
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    });
    const page = await browser.newPage();
    console.log("browser abierto en una nueva ventana");
    await page.goto(URL, { waitUntil: "domcontentloaded" });

    //scroll para cargar todos los videos
    console.log("Esperando los enlaces con el selector #video-title-link...");
    await page.waitForSelector("#video-title-link", { timeout: 10000 });
    console.log("Elementos #video-title-link cargados.");

    let previousHeight;
    while (true) {
      previousHeight = await page.evaluate(
        () => document.documentElement.scrollHeight
      );
      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight)
      );
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newHeight = await page.evaluate(
        () => document.documentElement.scrollHeight
      );
      if (newHeight === previousHeight) break;
    }
    console.log("abajo");
    // links de los videos
    const newVideos = await page.evaluate(() => {
      const videos = Array.from(document.querySelectorAll("#video-title-link"));
      return videos.map((video) => {
        const href = video.href;
        return { href };
      });
    });

    console.log(newVideos);
    await browser.close();

    return newVideos;
  } catch (error) {
    console.error("Error en linksLogic:", error);
    throw error;
  }
};

module.exports = linksLogic;
