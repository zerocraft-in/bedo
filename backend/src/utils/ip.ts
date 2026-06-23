import { Request } from 'express';

export const getClientIp = (
  req: Request
) => {
  return (
    req.ip ||
    req.socket
      .remoteAddress ||
    ''
  );
};