const puppeteer = require("puppeteer");
const storage = require("../connector/storage");

const run = async (_browser, params) => {
  console.log("Running", params.slug);
  let browser;
  if (!_browser) {
    browser = await puppeteer.launch();
  } else {
    browser = _browser;
  }

  try {
    const page = await browser.newPage();
    const start = +(new Date());
    console.log('NAV URL', params.url)
    const response = await page.goto(params.url);
    console.log('NAV URL', params.url, response.status())
    const pageTime = (+(new Date()) - start) / 1000;
    
    const screenshotBuffer = await page.screenshot({
      encoding: 'binary'
    });

    const screenshotPath = await storage.writeFile(screenshotBuffer, params.run_id, `${params.slug}.png`);

    const formElementPresent = !!(await page.$("#standard-form-field-email"));
    
    await page.close();
    if (!_browser) {
      await browser.close();
    }

    return {
      status: response.status(),
      check_element_exists: formElementPresent,
      screenshot_url: screenshotPath,
      run_timestamp: +(new Date()),
      page_time: pageTime,
      ...params
    };
  } catch (err) {
    return {
      status: 408,
      check_element_exists: formElementPresent,
      screenshot_url: '',
      run_timestamp: +(new Date()),
      page_time: 0,
      ...params
    };
  }
  
  
 
};
module.exports = run;
