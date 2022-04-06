const { chromium } = require("playwright-chromium");
const cp = require("child_process");
const clientPlaywrightVersion = cp
  .execSync("npx playwright --version")
  .toString()
  .trim()
  .split(" ")[1];

const browserManager = async () => {
  console.log('Browser starup')
  const caps = {
    browser: "chrome", // allowed browsers are `chrome`, `edge`, `playwright-chromium`, `playwright-firefox` and `playwright-webkit`
    os: "osx",
    os_version: "catalina",
    name: "My first playwright test",
    build: "playwright-build-1",
    "browserstack.username":  process.env.BROWSERSTACK_USERNAME,
    "browserstack.accessKey": process.env.BROWSERSTACK_ACCESS_KEY,
    "client.playwrightVersion": clientPlaywrightVersion, // Playwright version being used on your local project needs to be passed in this capability for BrowserStack to be able to map request and responses correctly
  };
  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
      JSON.stringify(caps)
    )}`,
  });

  return browser;
};

module.exports = browserManager;
