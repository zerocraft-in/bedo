import {
  Request,
  Response,
} from 'express';

import {
  SessionService,
} from '../services/session.service.js';

export class SessionController {

  static async sessions(
    req: Request,
    res: Response
  ) {

    const data =
      await SessionService
        .getSessions(
          req.user!.id
        );

    res.json(data);
  }

  static async devices(
    req: Request,
    res: Response
  ) {

    const data =
      await SessionService
        .getDevices(
          req.user!.id
        );

    res.json(data);
  }

  static async revoke(
    req: Request,
    res: Response
  ) {

    await SessionService
      .revokeSession(
        req.user!.id,
        req.params.sessionId
      );

    res.json({
      success: true,
    });
  }

}