const puppeteer = require('puppeteer');
const storage = require("../connector/storage");

let browserConfig = {
    timeout: 120000,
    defaultViewport: { width: 1920, height: 1080 },
    headless: true,
    args: [
      "--disable-gpu",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1920,1080",
      "--disable-dev-shm-usage",
    ],
};

let browser = puppeteer.launch(browserConfig);

exports.capture = async (req, res) => {
    const url = req.query.url;

    const instance = await browser;
    const page = await instance.newPage();

    const response = await page.goto(params.url);


    const screenshotBuffer = await page.screenshot({
        encoding: 'binary'
    });

    const screenshotPath = await storage.writeFile(screenshotBuffer, url, `${+(new Date())}.png`);
    

    res.json({
        status: response.status(),
        screenshot_url: screenshotPath,
        run_timestamp: +(new Date()),
        page_time: pageTime,
    })

    instance.close();
}