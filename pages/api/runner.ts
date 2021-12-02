import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import puppeteer from "puppeteer";

import firestore from "../../connector/firestore";

import worker from "../../runners/worker";
import datoCMS from "../../connector/datocms";

type Data = {
  runId?: string;
  error?: any;
};

const browserManager = (() => {
  let instance: any = null;

  const create = async () => {
    let browserConfig: any = {
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

    if (process.env.NODE_ENV != "development") {
      browserConfig.executablePath = "/usr/bin/chromium-browser";
    }

    instance = await puppeteer.launch();

    instance.on("disconnected", () => {
      console.log("BROWSER KILLED");
      if (instance.process() != null) instance.process().kill("SIGINT");
      instance = null;
    });

    console.log("BROWSER LAUNCHED");
    return instance;
  };

  return {
    getBrowser: async () => {
      if (!instance) {
        await create();
      }

      return {
        browser: instance,
        terminate: () => {
          if (instance) {
            instance.close();
          }
        },
      };
    },
  };
})();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    
    const data = await firestore.get();

    if (data[0] && data[0].status !== "COMPLETED") {
      throw new Error(
        "Other run in progress. Please wait for it to be finished."
      );
    }
    const browser = await browserManager.getBrowser();
    let runId = uuidv4();
    if (process.env.NODE_ENV == "development") {
      runId += "_dev";
    }


    await firestore.create(runId, {
      run_id: runId,
      timestamp: +new Date(),
      status: "RUNNING",
      duration: 0,
      total_pages: 0,
      success_pages: 0,
      failed_pages: 0,
      res: [],
    });


    const landingPages = await datoCMS.getAllLandingPages();
    

   

    let queryObjects = landingPages
      .filter((item) => item._status == "published")
      .map((item) => {
        return {
          run_id: runId,
          url: `${process.env.BASEURL}/${item.slug}`,
          ...item,
        };
      });

    worker(runId, queryObjects, "landingPageRunner", browser);

    res.status(200).json({ runId: runId });
  } catch (err: any) {
    console.log(err);
    res.status(422).json({ error: err.message ? err.message : err });
  }
}
