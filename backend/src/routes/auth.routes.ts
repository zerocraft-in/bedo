import { Router } from 'express';

import {
  AuthController,
} from '../controllers/auth.controller.js';

import {
  validate,
} from '../middleware/validation.middleware.js';

import {
  sendOtpSchema,
  verifyOtpSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post(
  '/send-otp',
  validate(sendOtpSchema),
  AuthController.sendOtp
);

router.post(
  '/verify-otp',
  validate(
    verifyOtpSchema
  ),
  AuthController.verifyOtp
);

export default router;