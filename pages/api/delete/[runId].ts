import type { NextApiRequest, NextApiResponse } from "next";

import firestore from "../../../connector/firestore";

type Data = {
  status?: any;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { runId } = req.query
    console.log(runId)
    await firestore.remove(runId);
    res.status(200).json({ status: 'removed' });
  } catch (err) {
    console.log(err);
    res.status(422).json({ error: err });
  }
}
