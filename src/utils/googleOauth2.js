import { env } from './env.js';
import path from 'path';
import { readFile } from 'node:fs/promises';
import { OAuth2Client } from 'google-auth-library';
import createHttpError from 'http-errors';
const clientId = env('GOOGLE_AUTH_CLIENT_ID');
const clientSecret = env('GOOGLE_AUTH_CLIENT_SECRET');

const oauthConfigPacth = path.resolve('google-oauth.json');
const oauthConfig = JSON.parse(await readFile(oauthConfigPacth));
const redirectUri = oauthConfig.web.redirect_uris[0];

const googleOauthClient = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri,
});

export function generateGoogleOAuthUri() {
  const uri = googleOauthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
  return uri;
}

export async function validGoogleCode(code) {
  const response = await googleOauthClient.getToken(code);
  if (!response.tokens.id_token) {
    throw createHttpError(401);
  }
  const ticket = await googleOauthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
}
