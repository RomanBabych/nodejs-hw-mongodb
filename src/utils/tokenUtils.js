import jwt from 'jsonwebtoken';

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error('Token secrets are not defined');
}

export const generateTokens = (userId) => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('Token secrets are not defined');
  }

  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
};
