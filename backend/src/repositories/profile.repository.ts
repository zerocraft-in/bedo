import { prisma } from '../config/prisma.js';

export class ProfileRepository {
  static findByUserId(
    userId: string
  ) {
    return prisma.profile.findUnique({
      where: {
        userId,
      },

      include: {
        goals: true,
      },
    });
  }

  static create(
    userId: string
  ) {
    return prisma.profile.create({
      data: {
        userId,
      },
    });
  }

  static update(
    userId: string,
    data: any
  ) {
    return prisma.profile.update({
      where: {
        userId,
      },

      data,
    });
  }
}