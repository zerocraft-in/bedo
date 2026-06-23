import {
  Request,
  Response,
} from "express";

import {
  OnboardingService,
} from "../services/onboarding.service.js";

export class OnboardingController {

  static async get(
    req: Request,
    res: Response
  ) {

    const profile =
      await OnboardingService.get(
        req.user!.id
      );

    res.status(200).json({
      success: true,
      data: profile,
    });
  }

  static async save(
    req: Request,
    res: Response
  ) {

    const profile =
      await OnboardingService.save(
        req.user!.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Onboarding completed",

      data: profile,
    });
  }
}