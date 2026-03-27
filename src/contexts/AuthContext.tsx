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
    org_id = '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  ) => {
    await authApi.signup({
      email,
      password,
      full_name: fullName,
      role,
      org_id,
    });
  };

  const signOut = async () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    setProfile(null);
  };

  const signInWithGoogle = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
        | string
        | undefined;
      if (!clientId) {
        reject(
          new Error(
            'Google sign-in is not configured. Please set VITE_GOOGLE_CLIENT_ID.',
          ),
        );
        return;
      }

      const handleCredential = async (response: { credential: string }) => {
        try {
          // Decode the Google ID token (JWT) to get user info — no secret needed for decoding
          const payload = JSON.parse(atob(response.credential.split('.')[1]));
          const { email, name, sub } = payload as {
            email: string;
            name: string;
            sub: string;
          };
          const derivedPassword = `google_${sub}`;

          try {
            // Returning user — try login first
            const result = await authApi.login({
              email,
              password: derivedPassword,
            });
            localStorage.setItem(AUTH_TOKEN_KEY, result.access_token);
            setUser(result.user);
            setProfile(result.user as unknown as UserProfile);
          } catch {
            // New user — create account then login
            await authApi.signup({
              email,
              password: derivedPassword,
              full_name: name,
              role: 'learner',
            });
            const result = await authApi.login({
              email,
              password: derivedPassword,
            });
            localStorage.setItem(AUTH_TOKEN_KEY, result.access_token);
            setUser(result.user);
            setProfile(result.user as unknown as UserProfile);
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      };

      const init = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const google = (window as any).google;
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredential,
        });
        google.accounts.id.prompt(
          (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
          }) => {
            if (
              notification.isNotDisplayed() ||
              notification.isSkippedMoment()
            ) {
              // Fallback: render a popup manually
              google.accounts.id.renderButton(
                document.createElement('div'),
                {},
              );
            }
          },
        );
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).google?.accounts) {
        init();
      } else {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = init;
        script.onerror = () =>
          reject(new Error('Failed to load Google Identity Services.'));
        document.head.appendChild(script);
      }
    });
  };

  const signInWithFacebook = async () => {
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
