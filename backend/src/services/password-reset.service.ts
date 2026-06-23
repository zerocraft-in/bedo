import { prisma } from '../config/prisma.js';

import {
  randomToken,
  hashString,
  addMinutes,
} from '../utils';

import { EmailService } from './email.service.js';

import {
  resetPasswordTemplate,
} from '../templates/reset-password.template.js';

export class PasswordResetService {

  static async sendResetLink(
    email: string
  ) {

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return;
    }

    const token =
      randomToken(32);

    const tokenHash =
      hashString(token);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt:
          addMinutes(30),
      },
    });

    const url =
      `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await EmailService.send(
      email,
      'Reset Password',
      resetPasswordTemplate(url)
    );
  }

  static async verifyToken(
    token: string
  ) {

    const tokenHash =
      hashString(token);

    const record =
      await prisma.passwordResetToken.findFirst({
        where: {
          tokenHash,
          usedAt: null,
        },

        orderBy: {
          createdAt:
            'desc',
        },
      });

    if (!record) {
      throw new Error(
        'Invalid token'
      );
    }

    if (
      record.expiresAt <
      new Date()
    ) {
      throw new Error(
        'Token expired'
      );
    }

    return record;
  }

  static async consume(
    id: string
  ) {

    return prisma.passwordResetToken.update({
      where: {
        id,
      },

      data: {
        usedAt:
          new Date(),
      },
    });
  }
}