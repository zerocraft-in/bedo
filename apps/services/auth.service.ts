// lib/services/auth.service.ts

import { Session, User } from "@/stores/auth.store";

const OTP_STORE = new Map<
  string,
  {
    otp: string;
    expiresAt: number;
  }
>();

const USERS: User[] = [
  {
    id: "user_001",
    name: "Alex Johnson",
    email: "alex@example.com",
    onboardingComplete: true,
  },
];

const OTP_TTL = 5 * 60 * 1000;

function generateOtp() {
  return String(
    Math.floor(100000 + Math.random() * 900000)
  );
}

function generateToken() {
  return (
    "token_" +
    Math.random().toString(36).slice(2)
  );
}

export async function sendOtp(email: string) {
  await new Promise((r) => setTimeout(r, 1000));

  const otp = generateOtp();

  OTP_STORE.set(email, {
    otp,
    expiresAt: Date.now() + OTP_TTL,
  });

  return { otp };
}

export async function verifyOtp(
  email: string,
  otp: string,
  name?: string
): Promise<Session> {
  await new Promise((r) => setTimeout(r, 1000));

  const record = OTP_STORE.get(email);

  if (!record)
    throw new Error("OTP not found");

  if (record.expiresAt < Date.now())
    throw new Error("OTP expired");

  if (record.otp !== otp)
    throw new Error("Invalid OTP");

  let user = USERS.find(
    (u) => u.email === email
  );

  if (!user) {
    user = {
      id: `user_${Date.now()}`,
      email,
      name: name || "User",
      onboardingComplete: false,
    };

    USERS.push(user);
  }

  const session: Session = {
    user,
    token: generateToken(),
    expiresAt:
      Date.now() +
      1000 * 60 * 60 * 24 * 7,
  };

  return session;
}