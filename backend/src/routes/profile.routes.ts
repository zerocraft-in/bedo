import { Router } from 'express';

import { authenticate }
from '../middleware/auth.middleware.js';

import { validate }
from '../middleware/validation.middleware.js';

import {
  updateProfileSchema,
} from '../validators/profile.validator.js';

import {
  ProfileController,
} from '../controllers/profile.controller.js';

const router = Router();

router.get(
  '/',
  authenticate,
  ProfileController.me
);

router.patch(
  '/',
  authenticate,
  validate(
    updateProfileSchema
  ),
  ProfileController.update
);

export default router;