import { ProfileRepository }
from '../repositories/profile.repository.js';

export class ProfileService {

  static async getProfile(
    userId: string
  ) {

    let profile =
      await ProfileRepository
        .findByUserId(
          userId
        );

    if (!profile) {
      profile =
        await ProfileRepository
          .create(
            userId
          );
    }

    return profile;
  }

  static async updateProfile(
    userId: string,
    data: any
  ) {

    return ProfileRepository
      .update(
        userId,
        data
      );
  }

}