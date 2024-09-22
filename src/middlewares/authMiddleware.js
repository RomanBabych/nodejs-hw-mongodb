import jwt from 'jsonwebtoken';
import createError from 'http-errors';

const authMiddleware = (req, res, next) => {
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
    req.user = decoded;

    if (Date.now() >= decoded.exp * 1000) {
      return next(createError(401, 'Unauthorized: Token expired'));
    }
    next();
  } catch {
    next(createError(401, 'Unauthorized: Invalid token'));
  }
};

export default authMiddleware;
