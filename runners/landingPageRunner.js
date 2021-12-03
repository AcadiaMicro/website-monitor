const cheerio = require('cheerio');

const run = async (params) => {
  console.log("Running clean", params.slug);
  
  try {

    const start = +(new Date());
    console.log('NAV URL', params.url)
    if (params.url == 'ampion-101') {
      params.url = '221'
    }
    const response = await fetch(params.url);
    const html = await response.text();
    console.log('NAV URL', params.url, response.status)
    const pageTime = (+(new Date()) - start) / 1000;

    const $ = cheerio.load(html);
    

    return {
      status: response.status,
      check_element_exists: $("#standard-form-field-email").length,
      meta_info_verified: html.indexOf(params.vid),
      screenshot_url: '',
      run_timestamp: +(new Date()),
      page_time: pageTime,
      ...params
    };
  } catch (err) {
    console.log(err)
    return {
      status: 408,
      check_element_exists: false,
      meta_info_verified: false,
      screenshot_url: '',
      run_timestamp: +(new Date()),
      page_time: 0,
      ...params
    };
  }
  
  
 
};
module.exports = run;
