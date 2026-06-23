import { prisma } from '../config/prisma.js';

export class SessionRepository {
  static getUserSessions(
    userId: string
  ) {
    return prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
      },

      include: {
        device: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static getSessionById(
    sessionId: string
  ) {
    return prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
  }

  static revokeSession(
    sessionId: string
  ) {
    return prisma.session.update({
      where: {
        id: sessionId,
      },

      data: {
        revokedAt: new Date(),
        status: 'REVOKED',
      },
    });
  }

  static getDevices(
    userId: string
  ) {
    return prisma.device.findMany({
      where: {
        userId,
      },

      orderBy: {
        lastActiveAt: 'desc',
      },
    });
  }
}