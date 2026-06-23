import { Request, Response }
from 'express';

import {
  OtpService,
} from '../services/otp.service.js';

import {
  AuthService,
} from '../services/auth.service.js';

export class AuthController {

  static async sendOtp(
    req: Request,
    res: Response
  ) {

    await OtpService.sendOtp(
      req.body.email
    );

    res.json({
      success: true,
    });

  }

  static async verifyOtp(
    req: Request,
    res: Response
  ) {

    const tokens =
      await AuthService.verifyOtp(
        req.body.email,
        req.body.otp
      );

    res.json(tokens);

  }

}