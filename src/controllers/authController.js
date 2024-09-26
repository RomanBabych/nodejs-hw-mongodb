import createError from 'http-errors';
import {
  registerUserService,
  loginUserService,
  logoutUserService,
  refreshSessionService,
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

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in an user!',
      data: { accessToken: tokens.accessToken },
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
    const userId = req.user.id;

    const session = await logoutUserService(userId);

    if (!session) {
      return next(createError(404, 'Session not found'));
    }

    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(createError(500, error.message));
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return next(createError(401, 'Refresh token not provided'));
    }

    const tokens = await refreshSessionService(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: { accessToken: tokens.accessToken },
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};
