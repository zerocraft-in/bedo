import { SessionRepository }
from '../repositories/session.repository.js';

import { AppError }
from '../utils/errors.js';

export class SessionService {

  static async getSessions(
    userId: string
  ) {
    return SessionRepository
      .getUserSessions(
        userId
      );
  }

  static async getDevices(
    userId: string
  ) {
    return SessionRepository
      .getDevices(
        userId
      );
  }

  static async revokeSession(
    userId: string,
    sessionId: string
  ) {

    const session =
      await SessionRepository
        .getSessionById(
          sessionId
        );

    if (!session) {
      throw new AppError(
        'Session not found',
        404
      );
    }

    if (
      session.userId !==
      userId
    ) {
      throw new AppError(
        'Forbidden',
        403
      );
    }

    return SessionRepository
      .revokeSession(
        sessionId
      );
  }
}