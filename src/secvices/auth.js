import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/session.js';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';
import { randomBytes } from 'crypto';
import { env } from '../utils/env.js';
import sendMail from '../utils/sendMail.js';
import { createJwtToken, verifyJwtToken } from '../utils/jwt.js';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { validGoogleCode } from '../utils/googleOauth2.js';


function createSessionData() {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
}


const app_domain = env('APP_DOMAIN');
export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');


export const register = async (payload) => {
  const { email, password } = payload;

  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const data = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  delete data._doc.password;

  return data._doc;
};

export const login = async (payload) => {
  const { email, password } = payload;

  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  // if (!user.verify) {
  //   throw createHttpError(401, 'Email not verify');
  // }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const sessionData = createSessionData();

  const userSession = await SessionCollection.create({
    ...sessionData,
    userId: user._id,
  });

  return userSession;
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const jwtToken = createJwtToken({email , sub: user._id});

  const resetPasswordTemplatePath = path.join(TEMPLATES_DIR , 'reset-password-email.html');
  const templatesSourse = (await fs.readFile(resetPasswordTemplatePath)).toString();

  const template = handlebars.compile(templatesSourse);
  const html = template({
    name: user.name,
    link: `${app_domain}/reset-password?token=${jwtToken}`
  });

  const verifyEmail = {
    to: email,
    subject: 'reset password',
    html
  };

  await sendMail(verifyEmail);
};
export const resetPassword = async(payload) => {
  const {data , error} = verifyJwtToken(payload.token);

  if(error) {
    throw createHttpError(401 , "Token is expired or invalid.");
  }
  const user = await UserCollection.findOne({email: data.email, _id: data.sub});

  if(!user) {
    throw createHttpError(404 , 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

};

export const findSessionByAccessToken = async (accessToken) =>
  SessionCollection.findOne({ accessToken });

export const findUser = async (filter) => {
  const data = await UserCollection.findOne(filter);
  return data;
};

export const refresh = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionCollection.findOne({
    refreshToken,
    _id: sessionId,
  });

  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const sessionData = createSessionData();

  const userSession = await SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });
  return userSession;
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const singinOrSingupWithGoogle = async (code) => {
  const loginTicket = await validGoogleCode(code);
  const payload = loginTicket.getPayload();

  let user = await UserCollection.findOne({email: payload.email});
  if(!user) {
    const password = randomBytes(10);
    const hashPassword = await bcrypt.hash(password , 10);
    user = await UserCollection.create({
      email: payload.email,
      password: hashPassword,
      name: payload.name,
    });
    delete user._doc.password;
  };
  const sessionData = createSessionData();
  const userSeesion = await SessionCollection.create({...sessionData , userId: user._id});
  return userSeesion;
};
