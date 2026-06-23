import { prisma } from '../config/prisma.js';

export class OtpRepository {

  static create(
    data: any
  ) {
    return prisma.otpCode.create({
      data,
    });
  }

  static findLatest(
    email: string
  ) {
    return prisma.otpCode.findFirst({
      where: {
        destination:
          email,
      },

      orderBy: {
        createdAt:
          'desc',
      },
    });
  }

  static consume(
    id: string
  ) {
    return prisma.otpCode.update({
      where: {
        id,
      },

      data: {
        consumedAt:
          new Date(),
      },
    });
  }
}