// lib/auth.tsx
// Central auth context: session storage, dummy OTP service, user store

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  onboardingComplete: boolean;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: number; // unix ms
}

interface AuthContextValue {
  session: Session | null;
  isLoading: boolean;
  /** Step 1 of login/register: send OTP to email. Returns the OTP (dev only). */
  sendOtp: (email: string) => Promise<{ otp: string }>;
  /** Step 2: verify OTP. On success returns the user (creates if new name given). */
  verifyOtp: (email: string, otp: string, name?: string) => Promise<User>;
  signOut: () => Promise<void>;
  /** Update user after onboarding completes */
  completeOnboarding: () => Promise<void>;
}

// ─── Dummy data store ─────────────────────────────────────────────────────────

// Pre-seeded dummy users. Real app: replace with API calls.
const DUMMY_USERS: User[] = [
  {
    id: "user_001",
    name: "Alex Johnson",
    email: "alex@example.com",
    onboardingComplete: true,
  },
  {
    id: "user_002",
    name: "Sam Rivera",
    email: "sam@example.com",
    onboardingComplete: false,
  },
];

// In-memory OTP store: email → { otp, expiresAt }
const OTP_STORE = new Map<string, { otp: string; expiresAt: number }>();

const SESSION_KEY = "@fitapp:session";
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateToken(): string {
  return "tok_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function generateUserId(): string {
  return "user_" + Math.random().toString(36).slice(2, 9);
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on boot
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw) {
          const stored: Session = JSON.parse(raw);
          if (stored.expiresAt > Date.now()) {
            setSession(stored);
          } else {
            await AsyncStorage.removeItem(SESSION_KEY);
          }
        }
      } catch {
        // ignore corrupt storage
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── sendOtp ─────────────────────────────────────────────────────────────────
  const sendOtp = useCallback(async (email: string) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const otp = generateOtp();
    OTP_STORE.set(email.toLowerCase().trim(), {
      otp,
      expiresAt: Date.now() + OTP_TTL_MS,
    });

    // In production: fire an email. Here we return it so the UI can show it.
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    return { otp };
  }, []);

  // ── verifyOtp ────────────────────────────────────────────────────────────────
  const verifyOtp = useCallback(
    async (email: string, otp: string, name?: string): Promise<User> => {
      await new Promise((r) => setTimeout(r, 600));

      const key = email.toLowerCase().trim();
      const record = OTP_STORE.get(key);

      if (!record) throw new Error("No OTP found. Please request a new one.");
      if (Date.now() > record.expiresAt)
        throw new Error("OTP expired. Please request a new one.");
      if (record.otp !== otp.trim()) throw new Error("Incorrect OTP.");

      OTP_STORE.delete(key); // one-time use

      // Find or create user
      let user = DUMMY_USERS.find((u) => u.email.toLowerCase() === key);
      if (!user) {
        user = {
          id: generateUserId(),
          name: name?.trim() || email.split("@")[0],
          email: key,
          onboardingComplete: false,
        };
        DUMMY_USERS.push(user);
      }

      // Persist session
      const newSession: Session = {
        user,
        token: generateToken(),
        expiresAt: Date.now() + TOKEN_TTL_MS,
      };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      setSession(newSession);

      return user;
    },
    []
  );

  // ── signOut ──────────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  // ── completeOnboarding ───────────────────────────────────────────────────────
  const completeOnboarding = useCallback(async () => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated: Session = {
        ...prev,
        user: { ...prev.user, onboardingComplete: true },
      };
      AsyncStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      // Also update in-memory store
      const idx = DUMMY_USERS.findIndex((u) => u.id === prev.user.id);
      if (idx >= 0) DUMMY_USERS[idx].onboardingComplete = true;
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, isLoading, sendOtp, verifyOtp, signOut, completeOnboarding }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}