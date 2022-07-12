import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

export const verifyToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    audience: process.env.OAUTH_CLIENT_ID as string,
    idToken: token,
  });
  const payload = ticket.getPayload();
  return payload;
};
