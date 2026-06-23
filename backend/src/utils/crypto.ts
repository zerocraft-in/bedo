import crypto from 'crypto';

export const hashString = (
  value: string
) => {
  return crypto
    .createHash('sha256')
    .update(value)
    .digest('hex');
};

export const randomToken = (
  length = 64
) => {
  return crypto
    .randomBytes(length)
    .toString('hex');
};