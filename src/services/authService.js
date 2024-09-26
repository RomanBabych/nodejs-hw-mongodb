import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';
import { generateTokens } from '../utils/tokenUtils.js';

export const registerUserService = async ({ name, email, password }) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
  } catch (error) {
    throw createError(500, error.message);
  }
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createError(401, 'Invalid email or password');
  }

  await Session.findOneAndDelete({ userId: user._id });

  const {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  } = generateTokens(user._id);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const logoutUserService = async (userId) => {
  const session = await Session.findOneAndDelete({ userId });

  if (!session) {
    throw createError(404, 'Session not found');
  }

  return session;
};

export const refreshSessionService = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const session = await Session.findOne({
    userId: decoded.userId,
    refreshToken,
  });

  if (!session) {
    throw createError(401, 'Invalid refresh token or session not found');
  }

  await Session.findOneAndDelete({ userId: decoded.userId });

  const {
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  } = generateTokens(decoded.userId);

  await Session.create({
    userId: decoded.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken: newRefreshToken };
};
