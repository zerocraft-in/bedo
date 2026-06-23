import {
  Request,
  Response,
} from 'express';

import {
  ProfileService,
} from '../services/profile.service.js';

export class ProfileController {

  static async me(
    req: Request,
    res: Response
  ) {

    const profile =
      await ProfileService
        .getProfile(
          req.user!.id
        );

    res.json(profile);
  }

  static async update(
    req: Request,
    res: Response
  ) {

    const profile =
      await ProfileService
        .updateProfile(
          req.user!.id,
          req.body
        );

    res.json(profile);
  }

}