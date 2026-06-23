import client from "@/lib/client";

export const AuthApi = {
  async sendOtp(email: string) {
    const { data } =
      await client.post(
        "/auth/send-otp",
        {
          email,
        }
      );

    return data;
  },

  async verifyOtp(
    email: string,
    otp: string
  ) {
    const { data } =
      await client.post(
        "/auth/verify-otp",
        {
          email,
          otp,
        }
      );

    return data;
  },

  async me(token: string) {
    const { data } =
      await client.get(
        "/profile",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
  },
};