import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt: string;
};

export type LoginDevice = {
  id: string;
  name: string;
  platform: string;
  location: string;
  loginAt: string;
  isCurrent: boolean;
  icon: string;
};

// Dummy users database
const DUMMY_USERS: (AuthUser & { password: string })[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'alex@fitai.com',
    password: 'password123',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'u2',
    name: 'Jordan Smith',
    email: 'jordan@fitai.com',
    password: 'password123',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
];

// Dummy OTPs store (email -> otp)
const otpStore: Record<string, { otp: string; expiresAt: number }> = {};

const DUMMY_DEVICES: LoginDevice[] = [
  {
    id: 'd1',
    name: 'iPhone 15 Pro',
    platform: 'iOS 17.2',
    location: 'Chennai, IN',
    loginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isCurrent: true,
    icon: 'phone-portrait-outline',
  },
  {
    id: 'd2',
    name: 'MacBook Pro',
    platform: 'macOS Sonoma',
    location: 'Chennai, IN',
    loginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrent: false,
    icon: 'laptop-outline',
  },
  {
    id: 'd3',
    name: 'iPad Air',
    platform: 'iPadOS 17',
    location: 'Mumbai, IN',
    loginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isCurrent: false,
    icon: 'tablet-landscape-outline',
  },
];

interface AuthState {
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  authUser: AuthUser | null;
  sessionToken: string | null;
  pendingOtpEmail: string | null;
  pendingOtpAction: 'login' | 'register' | null;
  pendingRegisterData: { name: string; email: string; password: string } | null;
  loginDevices: LoginDevice[];

  // Auth actions
  initAuth: () => Promise<void>;
  sendOtp: (email: string, action: 'login' | 'register') => Promise<{ success: boolean; message: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; message: string }>;
  registerWithOtp: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<AuthUser, 'name' | 'email' | 'avatar'>>) => Promise<{ success: boolean; message: string }>;
  deleteAccount: () => Promise<void>;
  removeDevice: (deviceId: string) => void;
  clearPendingOtp: () => void;
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthLoading: true,
  isAuthenticated: false,
  authUser: null,
  sessionToken: null,
  pendingOtpEmail: null,
  pendingOtpAction: null,
  pendingRegisterData: null,
  loginDevices: DUMMY_DEVICES,

  initAuth: async () => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('authUser'),
      ]);
      if (token && userData) {
        set({
          isAuthLoading: false,
          isAuthenticated: true,
          authUser: JSON.parse(userData),
          sessionToken: token,
        });
      } else {
        set({ isAuthLoading: false });
      }
    } catch {
      set({ isAuthLoading: false });
    }
  },

  sendOtp: async (email: string, action: 'login' | 'register') => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1000));

    if (action === 'login') {
      const user = DUMMY_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return { success: false, message: 'No account found with this email.' };
      }
    } else {
      const exists = DUMMY_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return { success: false, message: 'An account with this email already exists.' };
      }
    }

    // Generate and store OTP (6-digit)
    const otp = generateOtp();
    otpStore[email.toLowerCase()] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    // In real app: send email. Here we log it for demo.
    console.log(`[DEV] OTP for ${email}: ${otp}`);

    set({ pendingOtpEmail: email, pendingOtpAction: action });
    return { success: true, message: `OTP sent to ${email}. (Demo OTP: ${otp})` };
  },

  verifyOtp: async (otp: string) => {
    await new Promise(r => setTimeout(r, 800));
    const { pendingOtpEmail, pendingOtpAction, pendingRegisterData } = get();

    if (!pendingOtpEmail || !pendingOtpAction) {
      return { success: false, message: 'Session expired. Please try again.' };
    }

    const stored = otpStore[pendingOtpEmail.toLowerCase()];
    if (!stored) {
      return { success: false, message: 'OTP not found. Please request a new one.' };
    }
    if (Date.now() > stored.expiresAt) {
      delete otpStore[pendingOtpEmail.toLowerCase()];
      return { success: false, message: 'OTP expired. Please request a new one.' };
    }
    if (stored.otp !== otp.trim()) {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    delete otpStore[pendingOtpEmail.toLowerCase()];

    if (pendingOtpAction === 'login') {
      const dbUser = DUMMY_USERS.find(u => u.email.toLowerCase() === pendingOtpEmail.toLowerCase());
      if (!dbUser) return { success: false, message: 'User not found.' };

      const authUser: AuthUser = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        createdAt: dbUser.createdAt,
        lastLoginAt: new Date().toISOString(),
      };
      const token = generateToken();

      await AsyncStorage.multiSet([
        ['authToken', token],
        ['authUser', JSON.stringify(authUser)],
      ]);

      set({ isAuthenticated: true, authUser, sessionToken: token, pendingOtpEmail: null, pendingOtpAction: null });
      return { success: true, message: 'Logged in successfully!' };

    } else if (pendingOtpAction === 'register' && pendingRegisterData) {
      const newUser: AuthUser = {
        id: `u_${Date.now()}`,
        name: pendingRegisterData.name,
        email: pendingRegisterData.email,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      // Add to dummy DB
      DUMMY_USERS.push({ ...newUser, password: pendingRegisterData.password });

      const token = generateToken();
      await AsyncStorage.multiSet([
        ['authToken', token],
        ['authUser', JSON.stringify(newUser)],
      ]);

      set({
        isAuthenticated: true,
        authUser: newUser,
        sessionToken: token,
        pendingOtpEmail: null,
        pendingOtpAction: null,
        pendingRegisterData: null,
      });
      return { success: true, message: 'Account created successfully!' };
    }

    return { success: false, message: 'Something went wrong.' };
  },

  registerWithOtp: async (name: string, email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800));

    const exists = DUMMY_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    if (!name.trim() || name.trim().length < 2) {
      return { success: false, message: 'Name must be at least 2 characters.' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const otp = generateOtp();
    otpStore[email.toLowerCase()] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    console.log(`[DEV] OTP for ${email}: ${otp}`);

    set({
      pendingOtpEmail: email,
      pendingOtpAction: 'register',
      pendingRegisterData: { name, email, password },
    });

    return { success: true, message: `OTP sent to ${email}. (Demo OTP: ${otp})` };
  },

  loginWithPassword: async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 900));

    const dbUser = DUMMY_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!dbUser) {
      return { success: false, message: 'Invalid email or password.' };
    }

    const authUser: AuthUser = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      createdAt: dbUser.createdAt,
      lastLoginAt: new Date().toISOString(),
    };
    const token = generateToken();

    await AsyncStorage.multiSet([
      ['authToken', token],
      ['authUser', JSON.stringify(authUser)],
    ]);

    set({ isAuthenticated: true, authUser, sessionToken: token });
    return { success: true, message: 'Logged in successfully!' };
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['authToken', 'authUser']);
    set({
      isAuthenticated: false,
      authUser: null,
      sessionToken: null,
      pendingOtpEmail: null,
      pendingOtpAction: null,
      pendingRegisterData: null,
    });
  },

  updateProfile: async (updates) => {
    await new Promise(r => setTimeout(r, 600));
    const { authUser } = get();
    if (!authUser) return { success: false, message: 'Not authenticated.' };

    if (updates.email && updates.email !== authUser.email) {
      const exists = DUMMY_USERS.find(
        u => u.email.toLowerCase() === updates.email!.toLowerCase() && u.id !== authUser.id
      );
      if (exists) return { success: false, message: 'Email already in use.' };
    }

    const updated = { ...authUser, ...updates };
    await AsyncStorage.setItem('authUser', JSON.stringify(updated));

    // Update dummy DB
    const idx = DUMMY_USERS.findIndex(u => u.id === authUser.id);
    if (idx !== -1) Object.assign(DUMMY_USERS[idx], updates);

    set({ authUser: updated });
    return { success: true, message: 'Profile updated!' };
  },

  deleteAccount: async () => {
    const { authUser } = get();
    if (authUser) {
      const idx = DUMMY_USERS.findIndex(u => u.id === authUser.id);
      if (idx !== -1) DUMMY_USERS.splice(idx, 1);
    }
    await AsyncStorage.multiRemove(['authToken', 'authUser', 'hasCompletedOnboarding', 'user', 'chatMessages', 'workoutHistory']);
    set({ isAuthenticated: false, authUser: null, sessionToken: null });
  },

  removeDevice: (deviceId: string) => {
    set(state => ({
      loginDevices: state.loginDevices.filter(d => d.id !== deviceId),
    }));
  },

  clearPendingOtp: () => {
    set({ pendingOtpEmail: null, pendingOtpAction: null, pendingRegisterData: null });
  },
}));