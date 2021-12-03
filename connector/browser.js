// const puppeteer = require("puppeteer");

// const browserManager = async () => {
//     let browserConfig = {
//       timeout: 120000,
//       defaultViewport: { width: 1920, height: 1080 },
//       headless: true,
//       args: [
//         "--disable-gpu",
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--window-size=1920,1080",
//         "--disable-dev-shm-usage",
//       ],
//     };

//     if (process.env.NODE_ENV != "development") {
//       browserConfig.executablePath = "/usr/bin/chromium-browser";
//     }

//     let instance = await puppeteer.launch();

//     instance.on("disconnected", () => {
//       console.log("BROWSER KILLED");
//       if (instance.process() != null) instance.process().kill("SIGINT");
//       instance = null;
//     });

//     console.log("BROWSER LAUNCHED");
//     return instance;

// };

// module.exports = browserManager;

const { chromium } = require("playwright-chromium");

const browserManager = async () => {
  
    console.log("BROWSER LAUNCHED START");
    let browser = await chromium.launch({
      timeout: 120000,
      args: [
        "--disable-gpu",
        "--no-zygote",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--window-size=1920,1080",
        "--disable-dev-shm-usage",
      ],
    });

    browser.on("disconnected", () => {
      console.log("BROWSER KILLED");
    //   instance = null;
    });

    console.log("BROWSER LAUNCHED");

    return browser;
};

module.exports = browserManager;
