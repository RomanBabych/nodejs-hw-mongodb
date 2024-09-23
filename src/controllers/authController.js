import createError from 'http-errors';
import {
  registerUserService,
  loginUserService,
  logoutUserService,
} from '../services/authService.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUserService({ name, email, password });

    res.status(201).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tokens = await loginUserService({ email, password });

    if (!tokens) {
      return next(createError(401, 'Invalid email or password'));
    }

    res.status(200).json({
      status: 'success',
      data: tokens,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(createError(409, 'Duplicate session error'));
    }
    next(createError(500, error.message));
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const sessionId = req.user.sessionId;
    await logoutUserService(sessionId);

    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(createError(500, error.message));
  }
};
