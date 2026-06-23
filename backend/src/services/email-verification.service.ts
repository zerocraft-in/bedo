import { prisma } from '../config/prisma.js';

import {
  randomToken,
  hashString,
  addDays,
} from '../utils/index.js';

import { EmailService } from './email.service.js';

import {
  verifyEmailTemplate,
} from '../templates/verify-email.template.js';

export class EmailVerificationService {

  static async send(
    userId: string,
    email: string
  ) {

    const token =
      randomToken(32);

    const tokenHash =
      hashString(token);

    await prisma.emailVerificationToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt:
          addDays(1),
      },
    });

    const verifyUrl =
      `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await EmailService.send(
      email,
      'Verify Email',
      verifyEmailTemplate(
        verifyUrl
      )
    );
  }

  static async verify(
    token: string
  ) {

    const tokenHash =
      hashString(token);

    const record =
      await prisma.emailVerificationToken.findFirst({
        where: {
          tokenHash,
          verifiedAt: null,
        },
      });

    if (!record) {
      throw new Error(
        'Invalid verification token'
      );
    }

    if (
      record.expiresAt <
      new Date()
    ) {
      throw new Error(
        'Verification token expired'
      );
    }

    await prisma.user.update({
      where: {
        id:
          record.userId,
      },

      data: {
        emailVerified:
          true,

        emailVerifiedAt:
          new Date(),
      },
    });

    await prisma.emailVerificationToken.update({
      where: {
        id:
          record.id,
      },

      data: {
        verifiedAt:
          new Date(),
      },
    });

    return true;
  }
}