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
          "https://tobiassets.s3.us-east-2.amazonaws.com/chromium-v131.0.1-pack.tar?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMiJHMEUCIG%2FpImyTQuKCcUJXhWZZZyZ5SpuoFAICOyOotaXpo%2BD2AiEAgDLDx2M8g89yPBitLO7v6smFYOFZb%2FLmlTwL%2FOlCVzcq%2BQIIZRAAGgw1OTM3OTMwNjM0MzciDA%2F%2FRCShd3RS7JuN6CrWApidpHHbf4xg16e4ERih5QZPCNwcnOBcjBGsbfT9ddl52pR%2BaPI1AqZ5yirLZ6AmOTufCG3Xhhivg0VBAL0qvwNWAlIcWNeR70j%2B0fe8o9qpS7wFTV1HNYixhWQodjBEmNiXbyRyaWEpWrWRgrk6ei3mnsPqBelDvxkJ%2Bkhte6CAOPkkrmcqomZqIjbon%2BQoZaxzKGiPyEz96lU7GMnFWZqvf6%2Fv6p2btmQNaek0%2BbOyO5bHNWCtO36za27LzEcdXXOY3ii2xyJ%2BboHuLfxa6p9LYnsci2LBRoKYBzoq3KIfmF9CLYAHmFAVZf916%2FEigIlQDuAFLWXQZpkZtupf%2Fu%2BwU6hkHoZOn0C6RNHYqRuXAuoxiqskHvobaT%2B4KTyuDRaatMl%2F2KajY71UrwCnXPJR1cpp90m%2BTCWsk9VvmBGRF51K4w8HSolxlS3P6qAkoMfrePOwuzCosIy7BjqPAuexn%2F56YSKbqCIxcCO8qC7uAQ%2BEkyRh9Fs94W55lvjwcZbtsX4HVYcWc5xgBrwOx3u%2B47TAom1kfTZHvddETLtsCHbv5B1r73XXQp6NK7BRdyxgInZmpS7kMV7WBJ6wHkJek9V5fgK6FgkrWKUseum%2Fe0AMIxrmMNIdboxT0FhsDpyfY56Xt9xwgFX7t9EkoRMOogGi0tEtJ1LoAeJ%2Bzn63J1XN1C%2Bgq3c0z1sf1e8CTCLtGycAdsMazSDWW0omR3djGLe6LsQlWMpTlA82zFE6KS5G9mpeQ9TgxYRxPSme%2B%2FSuEH%2BwppKi1gsYVy3msdAznJBoIyqMBzOmJ89yeUQUPhYjrbZkMHyTYbzWDqg%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAYUQGTDIGW2W5OKYH%2F20241218%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20241218T193623Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=e749db11a7c5942880c4235e99da1326a0bb8df1bcb79797a7e1eae67be55d38"
        )),
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );
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
      await new Promise((resolve) => setTimeout(resolve, 500));

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
