const firestore = require("../connector/firestore");

const notifications = require("../notifications");

const BATCH_SIZE = 5;
const ASSETS_PATH = "public/runs";

const runners = {
  landingPageRunner: require("./landingPageRunner"),
};

const worker = async (runId, queue, runner, browser) => {
  console.log("PREPS");
  if (!queue || queue.length == 0) {
    throw new Error("QUEUE is not valid");
  }
  if (!runner || !runners[runner]) {
    throw new Error("Runner is not valid");
  }



  const start = +new Date();
  console.log("Working with worker", queue.length);

  // console.log(queryObjects)

  let res = [];

  for (let i = 1, len = Math.ceil(queue.length / BATCH_SIZE); i <= len; i++) {
    const start = (i - 1) * BATCH_SIZE;
    const end = i * BATCH_SIZE;
    console.log(start, end);
    let runResult = await Promise.all(
      queue.slice(start, end).map((item) => {
        return runners[runner](browser.browser, item);
      })
    );
    res = res.concat(runResult);
  }

  console.log((+new Date() - start) / 1000);

  const succesPages = res.filter((page) => page.status == 200);

  const successPagesAVGTime = succesPages.reduce((acc, page) => {
    return (acc += page.page_time);
  }, 0);

  const failedPages = res.filter((page) => page.status >= 400);

  const runData = {
    run_id: runId,
    timestamp: +new Date(),
    status: "COMPLETED",
    duration: (+new Date() - start) / 1000,
    total_pages: res.length,
    success_pages: succesPages.length,
    failed_pages: failedPages.length,
    avg_page_time:
      successPagesAVGTime > 0
        ? Math.round((successPagesAVGTime / succesPages.length) * 100) / 100
        : 0,
    res: res,
  }
  await firestore.update(runId, runData);

  if (failedPages.length > 0) {
    await notifications("missing_landing_pages", {
      landingPages: failedPages,
      run_id: runId,
    });
  } else {
    await notifications("success_run", runData);
  }

  await browser.terminate();
  
};

module.exports = worker;
