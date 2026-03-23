import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../utils/api-client';
import type { User } from '../types/database';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role:
    | 'learner'
    | 'instructor'
    | 'org_admin'
    | 'admin'
    | 'psychologist'
    | 'psychologist_pending';
  org_id: string | null;
  avatar: string | null;
  xp: number;
  streak: number;
  badges: any[];
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AUTH_TOKEN_KEY = 'cerebrolearn.auth.token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAndSetProfile = async () => {
    try {
      const userProfile = await authApi.getProfile();
      setUser(userProfile);
      setProfile(userProfile as unknown as UserProfile);
    } catch (error) {
      console.error('[Auth] Error fetching profile:', error);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
      setProfile(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          await fetchAndSetProfile();
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('[Auth] Error initializing auth:', error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for token changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_TOKEN_KEY) {
        if (e.newValue) {
          fetchAndSetProfile();
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    localStorage.setItem(AUTH_TOKEN_KEY, result.access_token);
    setUser(result.user);
    setProfile(result.user as unknown as UserProfile);
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role = 'learner',
  ) => {
    await authApi.signup({ email, password, full_name: fullName, role });
    // Auto sign in after successful registration
    await signIn(email, password);
  };

  const signOut = async () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    setProfile(null);
  };

  const signInWithGoogle = async () => {
    console.warn(
      '[Auth] Google sign-in is not yet implemented in the FastAPI backend.',
    );
    throw new Error('Google sign-in is not yet available.');
  };

  const signInWithFacebook = async () => {
    console.warn(
      '[Auth] Facebook sign-in is not yet implemented in the FastAPI backend.',
    );
    throw new Error('Facebook sign-in is not yet available.');
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchAndSetProfile();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        signInWithFacebook,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
