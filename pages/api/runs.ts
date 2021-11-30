import type { NextApiRequest, NextApiResponse } from "next";

import firestore from "../../connector/firestore";

type Data = {
  data?: any;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const data = await firestore.get();
    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(422).json({ error: err });
  }
}
