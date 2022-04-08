const run = async (params) => {
  const start = +(new Date());
  
  try {

    const start = +(new Date());
    const response = await fetch(params.url);
    const html = await response.text();
    const pageTime = (+(new Date()) - start) / 1000;
    

    return {
      status: response.status,
      check_element_exists: html.includes('standard-form-field-email'),
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
