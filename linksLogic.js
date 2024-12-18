const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium-min");

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

const linksLogic = async (channelLink) => {
  try {
    const URL = `${channelLink}/videos`;
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
    let previousHeight;
    while (true) {
      previousHeight = await page.evaluate(
        () => document.documentElement.scrollHeight
      );
      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight)
      );
      await new Promise((resolve) => setTimeout(resolve, 400));

      const newHeight = await page.evaluate(
        () => document.documentElement.scrollHeight
      );
      if (newHeight === previousHeight) break;
    }

    // links de los videos
    const videos = await page.evaluate(() => {
      const videoElements = Array.from(
        document.querySelectorAll("a#video-title")
      );
      console.log(videoElements);
      return videoElements.map((video) => ({ href: video.href }));
    });

    await browser.close();
    return videos;
  } catch (error) {
    console.error("Error en linksLogic:", error);
    throw error;
  }
};

module.exports = linksLogic;
