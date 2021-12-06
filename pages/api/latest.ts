import type { NextApiRequest, NextApiResponse } from "next";

import firestore from "../../connector/firestore";
import locals from "../../utils/locals";

type Data = {
  status?: any;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const data = await firestore.get();
    
    let run;
    for ( run of data) {
        if (run.status !== locals.PROGRESS) {
            break;
        }

    }
    res.status(200).json({ status: run });
  } catch (err) {
    console.log(err);
    res.status(422).json({ error: err });
  }
}
