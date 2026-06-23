import { Router }
from "express";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

import {
  validate,
} from "../middleware/validation.middleware.js";

import {
  onboardingSchema,
} from "../validators/onboarding.validator.js";

import {
  OnboardingController,
} from "../controllers/onboarding.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  OnboardingController.get
);

router.post(
  "/",
  authenticate,
  (req, _res, next) => {
    console.log("BODY:", req.body);
    next();
  },
  validate(onboardingSchema),
  OnboardingController.save
);

export default router;