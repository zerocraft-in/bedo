import { generateOtp } from '../utils';
import { hashString } from '../utils';
import { addMinutes } from '../utils';

import { otpTemplate }
from '../templates/otp.template.js';

import { EmailService }
from './email.service.js';

import { OtpRepository }
from '../repositories/otp.repository.js';

export class OtpService {

  static async sendOtp(
    email: string
  ) {

    const otp =
      generateOtp();

    await OtpRepository.create({
      destination:
        email,

      codeHash:
        hashString(otp),

      purpose:
        'LOGIN',

      expiresAt:
        addMinutes(10),
    });

    await EmailService.send(
      email,
      'Verification Code',
      otpTemplate(otp)
    );
  }

}