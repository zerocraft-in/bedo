import { Request } from 'express';

export const getUserAgent = (
  req: Request
) => {
  return (
    req.headers[
      'user-agent'
    ] || 'Unknown'
  );
};