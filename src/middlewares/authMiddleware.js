import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

  if (!ACCESS_TOKEN_SECRET) {
    throw new Error('Access token secret is not defined');
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(createError(401, 'Unauthorized: No token provided'));
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    if (Date.now() >= decoded.exp * 1000) {
      return next(createError(401, 'Unauthorized: Token expired'));
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('User not found in database');
      return next(createError(401, 'Unauthorized: User not found'));
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    next(createError(401, 'Unauthorized: Invalid token'));
  }
};

export default authMiddleware;
