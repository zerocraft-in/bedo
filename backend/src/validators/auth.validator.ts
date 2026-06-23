import { z } from 'zod';

export const sendOtpSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email address')
      .trim()
      .toLowerCase(),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email()
      .trim()
      .toLowerCase(),

    otp: z
      .string()
      .length(
        6,
        'OTP must be 6 digits'
      )
      .regex(
        /^[0-9]+$/,
        'OTP must contain only digits'
      ),
  }),
});

export const refreshTokenSchema =
  z.object({
    body: z.object({
      refreshToken:
        z.string().min(1),
    }),
  });

export type SendOtpInput =
  z.infer<
    typeof sendOtpSchema
  >;

export type VerifyOtpInput =
  z.infer<
    typeof verifyOtpSchema
  >;