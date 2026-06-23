import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { TokenService } from './token.service.js';

const client = new OAuth2Client(
  env.GOOGLE_CLIENT_ID
);

export class GoogleAuthService {
  static async login(
    idToken: string
  ) {
    const ticket =
      await client.verifyIdToken({
        idToken,
        audience:
          env.GOOGLE_CLIENT_ID,
      });

    const payload =
      ticket.getPayload();

    if (!payload?.email) {
      throw new Error(
        'Google email not found'
      );
    }

    let user =
      await prisma.user.findUnique({
        where: {
          email:
            payload.email,
        },
      });

    if (!user) {
      user =
        await prisma.user.create({
          data: {
            email:
              payload.email,

            emailVerified:
              true,

            emailVerifiedAt:
              new Date(),

            provider:
              'GOOGLE',
          },
        });
    }

    const tokens =
      TokenService.generate(
        user.id
      );

    return {
      user,
      ...tokens,
    };
  }
}