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
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError(401, 'Invalid email or password');
    }

    const { accessToken, refreshToken, refreshTokenValidUntil } =
      generateTokens(user._id);

    await Session.findOneAndUpdate(
      { userId: user._id },
      {
        accessToken,
        refreshToken,
        refreshTokenValidUntil,
      },
      { upsert: true, new: true },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    throw createError(500, error.message);
  }
};
