import { Router } from 'express';

import { authenticate }
from '../middleware/auth.middleware.js';

import {
  SessionController,
} from '../controllers/session.controller.js';

const router = Router();

router.get(
  '/',
  authenticate,
  SessionController.sessions
);

router.get(
  '/devices',
  authenticate,
  SessionController.devices
);

router.delete(
  '/:sessionId',
  authenticate,
  SessionController.revoke
);

export default router;