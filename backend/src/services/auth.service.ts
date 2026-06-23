import {
  hashString,
} from '../utils';

import {
  AuthRepository,
} from '../repositories/auth.repository.js';

import {
  OtpRepository,
} from '../repositories/otp.repository.js';

import {
  TokenService,
} from './token.service.js';

export class AuthService {

  static async verifyOtp(
    email: string,
    otp: string
  ) {

    const record =
      await OtpRepository.findLatest(
        email
      );

    if (!record) {
      throw new Error(
        'OTP not found'
      );
    }

    if (
      record.codeHash !==
      hashString(otp)
    ) {
      throw new Error(
        'Invalid OTP'
      );
    }

    let user =
      await AuthRepository.findByEmail(
        email
      );

    if (!user) {
      user =
        await AuthRepository.createUser(
          email
        );
    }

    await OtpRepository.consume(
      record.id
    );

    return TokenService.generate(
      user.id
    );
  }

}