import {
  Request,
  Response,
  NextFunction,
} from 'express';

export const authorize =
  (...roles: string[]) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const role =
      (req.user as any)
        ?.role;

    if (
      !role ||
      !roles.includes(role)
    ) {
      return next(
        new Error(
          'Forbidden'
        )
      );
    }

    next();
  };