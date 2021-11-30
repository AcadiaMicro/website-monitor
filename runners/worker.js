
const firestore = require("../connector/firestore");


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

  await firestore.create(runId, {
    run_id: runId,
    timestamp: +new Date(),
    status: "RUNNING",
    duration: 0,
    total_pages: queue.length,
    success_pages: 0,
    failed_pages: 0,
    res: [],
  });

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
        return runners[runner](browser, item);
      })
    );
    res = res.concat(runResult);
  }

  console.log((+new Date() - start) / 1000);

  await firestore.update(runId, {
    run_id: runId,
    timestamp: +new Date(),
    status: "COMPLETED",
    duration: (+new Date() - start) / 1000,
    total_pages: res.length,
    success_pages: res.filter((page) => page.status == 200).length,
    failed_pages: res.filter((page) => page.status >= 400).length,
    res: res,
  });
};

module.exports = worker;
