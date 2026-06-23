import { z } from "zod";

export const onboardingSchema = z.object({
  body: z.object({
    gender: z.preprocess(
      (v) => String(v).toUpperCase(),
      z.enum(["MALE", "FEMALE", "OTHER"])
    ),

    heightValue: z.coerce.number().min(50).max(300),

    heightUnit: z.preprocess(
      (v) => String(v).toUpperCase(),
      z.enum(["CM", "FT"])
    ),

    weightValue: z.coerce.number().min(20).max(500),

    weightUnit: z.preprocess(
      (v) => String(v).toUpperCase(),
      z.enum(["KG", "LB"])
    ),

    experience: z.preprocess(
      (v) => String(v).toUpperCase(),
      z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
    ),

    goal: z.preprocess(
      (v) => String(v).toUpperCase(),
      z.enum([
        "LOSE_WEIGHT",
        "GAIN_WEIGHT",
        "BUILD_MUSCLE",
        "STAY_FIT",
        "IMPROVE_ENDURANCE",
      ])
    ),
  }),
});

export type OnboardingInput =
  z.infer<typeof onboardingSchema>;