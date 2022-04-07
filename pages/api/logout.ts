import type { NextApiRequest, NextApiResponse } from "next";

import { removeTokenCookie } from "../../utils/auth-cookies"


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
try {
    removeTokenCookie(res)
    res.redirect('/login')
  } catch (err) {
    console.log(err);
    res.redirect('/login')
  }
}
