import { Router } from 'express';

import {
  authenticate,
} from '../middleware/auth.middleware.js';

import {
  upload,
} from '../middleware/upload.middleware.js';

import {
  UploadController,
} from '../controllers/upload.controller.js';

const router = Router();

router.post(
  '/avatar',
  authenticate,
  upload.single(
    'avatar'
  ),
  UploadController.avatar
);

export default router;