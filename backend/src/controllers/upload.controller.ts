import {
  Request,
  Response,
} from 'express';

import {
  CloudinaryService,
} from '../services/cloudinary.service.js';

import {
  ProfileRepository,
} from '../repositories/profile.repository.js';

export class UploadController {

  static async avatar(
    req: Request,
    res: Response
  ) {

    if (!req.file) {
      throw new Error(
        'File is required'
      );
    }

    const result =
      await CloudinaryService.uploadImage(
        req.file.path,
        'avatars'
      );

    await ProfileRepository.update(
      req.user!.id,
      {
        avatarUrl:
          result.url,
      }
    );

    res.json({
      success: true,
      avatarUrl:
        result.url,
    });
  }

}