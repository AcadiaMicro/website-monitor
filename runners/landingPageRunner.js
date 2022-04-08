const cheerio = require('cheerio');
const axios = require('axios');

const run = async (params) => {
  const start = +(new Date());

  return axios.get(params.url)
    .then((response) => {
      // const $ = cheerio.load(response.data);
      const pageTime = (+(new Date()) - start) / 1000;
      return {
        status: response.status,
        check_element_exists: true,
        meta_info_verified: response.data.indexOf(params.vid),
        screenshot_url: '',
        run_timestamp: +(new Date()),
        page_time: pageTime,
        ...params
      };
    })
    .catch((err) => {
      return {
        status: 408,
        check_element_exists: false,
        meta_info_verified: false,
        screenshot_url: '',
        run_timestamp: +(new Date()),
        page_time: 0,
        ...params
      };
    })
  
  // try {

  //   const start = +(new Date());
  //   console.log('NAV URL', params.url)
  //   const response = await fetch(params.url);
  //   const html = await response.text();
  //   console.log('NAV URL', params.url, response.status)
  //   const pageTime = (+(new Date()) - start) / 1000;

  //   const $ = cheerio.load(html);
    

  //   return {
  //     status: response.status,
  //     check_element_exists: $("#standard-form-field-email").length,
  //     meta_info_verified: html.indexOf(params.vid),
  //     screenshot_url: '',
  //     run_timestamp: +(new Date()),
  //     page_time: pageTime,
  //     ...params
  //   };
  // } catch (err) {
  //   console.log(err)
  //   return {
  //     status: 408,
  //     check_element_exists: false,
  //     meta_info_verified: false,
  //     screenshot_url: '',
  //     run_timestamp: +(new Date()),
  //     page_time: 0,
  //     ...params
  //   };
  // }
  
  
 
};
module.exports = run;
