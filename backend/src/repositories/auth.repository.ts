import { prisma } from '../config/prisma.js';

export class AuthRepository {
  static findByEmail(
    email: string
  ) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static createUser(
    email: string
  ) {
    return prisma.user.create({
      data: {
        email,
      },
    });
  }

  static updateLastLogin(
    userId: string
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        lastLoginAt:
          new Date(),
      },
    });
  }
}