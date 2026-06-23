import { z } from 'zod';

export const revokeSessionSchema =
  z.object({
    params: z.object({
      sessionId: z
        .string()
        .cuid(),
    }),
  });

export const revokeDeviceSchema =
  z.object({
    params: z.object({
      deviceId: z
        .string()
        .cuid(),
    }),
  });

export const paginationSchema =
  z.object({
    query: z.object({
      page: z
        .coerce
        .number()
        .min(1)
        .default(1),

      limit: z
        .coerce
        .number()
        .min(1)
        .max(100)
        .default(10),
    }),
  });

export type RevokeSessionInput =
  z.infer<
    typeof revokeSessionSchema
  >;