import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/errors.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(
        'Unauthorized',
        401
      );
    }

    const token =
      authHeader.split(' ')[1];

    const payload =
      jwt.verify(
        token,
        env.JWT_ACCESS_SECRET
      ) as {
        userId: string;
      };

    const user =
      await prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });

    if (!user) {
      throw new AppError(
        'User not found',
        404
      );
    }

    req.user = {
      id: user.id,
      email: user.email ?? undefined,
    };

    next();
  } catch {
    next(
      new AppError(
        'Invalid token',
        401
      )
    );
  }
};