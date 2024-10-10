// import createHttpError from "http-errors";
import * as authServices from "../secvices/auth.js";
import { generateGoogleOAuthUri } from "../utils/googleOauth2.js";

function setupSession(res, session) {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expire: new Date(Date.now() + session.refreshTokenValidUntil),
  });


  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expire: new Date(Date.now() + session.refreshTokenValidUntil),

  });
}

export const signupController = async (req , res) => {
  const data = await authServices.register(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data,
  });
};
export const singinController = async (req , res) => {
  const session = await authServices.login(req.body);

  setupSession(res , session);

  res.status(200).json({
    status: 200,
    message: "Successfully logged in an user!",
    data :{
      accessToken: session.accessToken,
    },
  });
};

export const requestResetEmailController = async (req, res) => {
  await authServices.requestResetToken(req.body.email);
  res.status(200).json({
    message: 'Reset password email has been successfully sent',
    status: 200,
    data: {},
  });
};
export const resesPasswordController = async (req , res) => {
  await authServices.resetPassword(req.body);
  res.status(200).json({
    message: 'Password was successfully reset!',
    stats: 200,
    data: {},
  });
};

export const refreshController = async (req , res) => {
  const {refreshToken , sessionId} = req.cookies;

  const session = await authServices.refresh({refreshToken , sessionId});

  setupSession(res , session);

  res.status(200).json({
    status: 200,
    message: "Successfully refreshed a session!",
    data :{
      accessToken: session.accessToken,
    },
  });
};
export const logoutController = async (req, res) => {
  const {sessionId} = req.cookies;
  if(sessionId) {
    authServices.logout(sessionId);
  }
  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");

  res.status(204).send();
};
export const getGoogleOAuthUriController= async (req , res) => {
  const uri = generateGoogleOAuthUri();
  res.status(200).json({
    message: 'Successfully get google OAuth uri',
    status: 200,
    data: {uri}
  });
};
export const loginWithGoogleOAuthController = async (req , res) => {
  const session = await authServices.singinOrSingupWithGoogle(req.body.code);
  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfuly login by Google OAuth',
    data: {
      accessToken: session.accessToken,
    }
  });
};
