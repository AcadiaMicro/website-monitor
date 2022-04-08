import type { NextApiRequest, NextApiResponse } from "next";

import { setTokenCookie } from "../../utils/auth-cookies"

type Data = {
  status?: any;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
try {
    if (!req.body.g_csrf_token || !req.cookies.g_csrf_token || req.body.g_csrf_token != req.cookies.g_csrf_token) {
        return res.redirect('/403')
    }
    setTokenCookie(res, req.body.credential)
    
    res.redirect('/')
  } catch (err) {
    console.log(err);
    res.status(422).json({ error: err });
  }
}
