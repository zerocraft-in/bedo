import { ZodObject } from 'zod';
import {
  Request,
  Response,
  NextFunction,
} from 'express';

export const validate =
  (schema: ZodObject) =>
  async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      next(error);
    }
  };