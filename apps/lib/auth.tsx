import {
  createContext,
  useContext,
  useEffect,
} from "react";

import { AuthApi }
from "@/lib/api/auth.api";

import {
  useAuthStore,
} from "@/stores/auth.store";

const AuthContext =
  createContext<any>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const {
    session,
    isLoading,
    restoreSession,
    login,
    logout,
    completeOnboarding,
  } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, []);

  async function sendOtp(
    email: string
  ) {
    return AuthApi.sendOtp(
      email
    );
  }

  async function verifyOtp(
    email: string,
    otp: string
  ) {

    const response =
      await AuthApi.verifyOtp(
        email,
        otp
      );

    await login({
      accessToken:
        response.accessToken,

      refreshToken:
        response.refreshToken,

      expiresAt:
        Date.now() +
        15 * 60 * 1000,

      user:
        response.user,
    });

    return response.user;
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,

        sendOtp,
        verifyOtp,

        logout,

        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}