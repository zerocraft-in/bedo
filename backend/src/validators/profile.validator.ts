import { z } from 'zod';

export const updateProfileSchema =
  z.object({
    body: z.object({
      firstName: z
        .string()
        .min(2)
        .max(50)
        .optional(),

      lastName: z
        .string()
        .min(2)
        .max(50)
        .optional(),

      displayName: z
        .string()
        .min(2)
        .max(50)
        .optional(),

      gender: z
        .enum([
          'MALE',
          'FEMALE',
          'OTHER',
          'PREFER_NOT_TO_SAY',
        ])
        .optional(),

      fitnessLevel: z
        .enum([
          'BEGINNER',
          'INTERMEDIATE',
          'ADVANCED',
        ])
        .optional(),

      heightValue: z
        .number()
        .positive()
        .optional(),

      weightValue: z
        .number()
        .positive()
        .optional(),
    }),
  });

export type UpdateProfileInput =
  z.infer<
    typeof updateProfileSchema
  >;