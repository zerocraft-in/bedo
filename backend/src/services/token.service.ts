import {
  signAccessToken,
  signRefreshToken,
} from '../utils';

export class TokenService {

  static generate(
    userId: string
  ) {

    return {
      accessToken:
        signAccessToken({
          userId,
        }),

      refreshToken:
        signRefreshToken({
          userId,
        }),
    };

  }

}