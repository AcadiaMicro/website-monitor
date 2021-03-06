import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import Honeybadger from '@honeybadger-io/js';

import firestore from "../../connector/firestore";

import worker from "../../runners/worker";
import datoCMS from "../../connector/datocms";

import locals from '../../utils/locals';


type Data = {
  runId?: string;
  error?: any;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    
    const data = await firestore.get();

    if (data[0] && data[0].status == locals.PROGRESS) {
      throw new Error(
        "Other run in progress. Please wait for it to be finished."
      );
    }
    let runId = uuidv4();
    if (process.env.NODE_ENV == "development") {
      runId += "_dev";
    }


    await firestore.create(runId, {
      run_id: runId,
      timestamp: +new Date(),
      status: locals.PROGRESS,
      duration: 0,
      total_pages: 0,
      success_pages: 0,
      failed_pages: 0,
      res: [],
      runner: process.env.DEFAULT_RUNNER
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

    worker(runId, queryObjects, process.env.DEFAULT_RUNNER);

    res.status(200).json({ runId: runId });
  } catch (err: any) {
    console.log(err);
    Honeybadger.notify(err);
    
    res.status(422).json({ error: err.message ? err.message : err });
  }
}
