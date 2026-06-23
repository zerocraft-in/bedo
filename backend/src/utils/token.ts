import crypto from 'crypto';

export const createRefreshFamily =
  () =>
    crypto.randomUUID();

export const createSessionToken =
  () =>
    crypto.randomUUID();