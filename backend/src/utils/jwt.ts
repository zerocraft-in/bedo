import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

interface JwtPayload {
  userId: string;
  sessionId?: string;
}

export const signAccessToken = (
  payload: JwtPayload
) => {
  return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: '15m',
    }
  );
};

export const signRefreshToken = (
  payload: JwtPayload
) => {
  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const verifyAccessToken = (
  token: string
) => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  );
};

export const verifyRefreshToken = (
  token: string
) => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  );
};