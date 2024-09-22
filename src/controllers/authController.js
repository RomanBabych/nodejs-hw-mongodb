import createError from 'http-errors';
import {
  registerUserService,
  loginUserService,
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

    res.status(200).json({
      status: 'success',
      data: tokens,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};
