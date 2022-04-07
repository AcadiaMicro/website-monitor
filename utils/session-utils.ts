import { OAuth2Client } from "google-auth-library";

export const validateToken = async (token: string) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLOUD_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLOUD_ID,
    });
    const payload = ticket.getPayload();
    
    return (
      payload &&
      payload.iss.includes("accounts.google.com") &&
      payload.hd == "ampion.net" &&
      payload.email_verified
    );
  } catch (err) {
    return false;
  }
};
