import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../../../utils/api-client';
import type { User } from '../types/database';

let googleIdentityScriptPromise: Promise<any> | null = null;
let facebookSdkPromise: Promise<any> | null = null;

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role:
    | 'learner'
    | 'iq_user'
    | 'instructor'
    | 'org_admin'
    | 'admin'
    | 'psychologist'
    | 'psychologist_pending';
  org_id: string | null;
  avatar: string | null;
  bio?: string | null;
  phone_number?: string | null;
  location?: string | null;
  xp: number;
  streak: number;
  badges: any[];
  created_at: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isFirstLogin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: string,
    orgId?: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  renderGoogleButton: (
    container: HTMLElement,
    onCredential: (credential: string) => void,
  ) => Promise<void>;
  getFacebookAccessToken: () => Promise<string>;
  lookupGoogleAccount: (credential: string) => Promise<{
    exists: boolean;
    role?: string | null;
  }>;
  lookupFacebookAccount: (accessToken: string) => Promise<{
    exists: boolean;
    role?: string | null;
  }>;
  completeGoogleSignIn: (credential: string, role?: string) => Promise<void>;
  completeFacebookSignIn: (accessToken: string, role?: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AUTH_TOKEN_KEY = 'cerebrolearn.auth.token';
const AUTH_FIRST_LOGIN_KEY = 'cerebrolearn.auth.is_first_login';
const USER_INTENT_KEY = 'cerebrolearn.user.intent';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readFirstLoginFlag = () => {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(AUTH_FIRST_LOGIN_KEY) === 'true';
};

const writeFirstLoginFlag = (value: boolean) => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(AUTH_FIRST_LOGIN_KEY, String(value));
};

const clearFirstLoginFlag = () => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(AUTH_FIRST_LOGIN_KEY);
};

const getSocialSignupRole = (selectedRole = 'learner') => {
  if (typeof window === 'undefined') return selectedRole;
  return window.sessionStorage.getItem(USER_INTENT_KEY) === 'iq-only'
    ? 'iq_user'
    : selectedRole;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(readFirstLoginFlag);
  const [loading, setLoading] = useState(true);

  const fetchAndSetProfile = async () => {
    try {
      const userProfile = await authApi.getProfile();
      setUser(userProfile);
      setProfile(userProfile as unknown as UserProfile);
      setIsFirstLogin(readFirstLoginFlag());
    } catch (error) {
      console.error('[Auth] Error fetching profile:', error);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(USER_INTENT_KEY);
      clearFirstLoginFlag();
      setUser(null);
      setProfile(null);
      setIsFirstLogin(false);
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
          setIsFirstLogin(false);
        }
      } catch (error) {
        console.error('[Auth] Error initializing auth:', error);
        setUser(null);
        setProfile(null);
        setIsFirstLogin(false);
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
          clearFirstLoginFlag();
          setUser(null);
          setProfile(null);
          setIsFirstLogin(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    applyAuthResult(result);
  };

  const applyAuthResult = (result: {
    access_token: string;
    user: User;
    is_first_login: boolean;
  }) => {
    localStorage.setItem(AUTH_TOKEN_KEY, result.access_token);
    writeFirstLoginFlag(result.is_first_login);
    setUser(result.user);
    setProfile(result.user as unknown as UserProfile);
    setIsFirstLogin(result.is_first_login);
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role = 'learner',
    orgId = '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  ) => {
    await authApi.signup({
      email,
      password,
      full_name: fullName,
      role,
      org_id: orgId,
    });
  };

  const signOut = async () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(USER_INTENT_KEY);
    clearFirstLoginFlag();
    setUser(null);
    setProfile(null);
    setIsFirstLogin(false);
  };

  const loadGoogleIdentityServices = async (): Promise<any> => {
    if (typeof window === 'undefined') {
      throw new Error('Google sign-in is only available in the browser.');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).google?.accounts?.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (window as any).google;
    }

    if (!googleIdentityScriptPromise) {
      googleIdentityScriptPromise = new Promise((resolve, reject) => {
        const existingScript = document.querySelector(
          'script[src="https://accounts.google.com/gsi/client"]',
        ) as HTMLScriptElement | null;

        const handleLoad = () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const google = (window as any).google;
          if (google?.accounts?.id) {
            resolve(google);
          } else {
            googleIdentityScriptPromise = null;
            reject(new Error('Failed to initialize Google Identity Services.'));
          }
        };

        const handleError = () => {
          googleIdentityScriptPromise = null;
          reject(new Error('Failed to load Google Identity Services.'));
        };

        if (existingScript) {
          existingScript.addEventListener('load', handleLoad, { once: true });
          existingScript.addEventListener('error', handleError, { once: true });
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = handleLoad;
        script.onerror = handleError;
        document.head.appendChild(script);
      });
    }

    return googleIdentityScriptPromise;
  };

  const loadFacebookSdk = async (): Promise<any> => {
    if (typeof window === 'undefined') {
      throw new Error('Facebook sign-in is only available in the browser.');
    }

    const appId = import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined;
    if (!appId) {
      throw new Error(
        'Facebook sign-in is not configured. Please set VITE_FACEBOOK_APP_ID.',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).FB) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (window as any).FB;
    }

    if (!facebookSdkPromise) {
      facebookSdkPromise = new Promise((resolve, reject) => {
        const initialize = () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const FB = (window as any).FB;
          if (!FB) {
            facebookSdkPromise = null;
            reject(new Error('Failed to initialize Facebook SDK.'));
            return;
          }

          FB.init({
            appId,
            cookie: false,
            xfbml: false,
            version: 'v20.0',
          });
          resolve(FB);
        };

        const existingScript = document.getElementById('facebook-jssdk') as
          | HTMLScriptElement
          | null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const previousInit = (window as any).fbAsyncInit;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).fbAsyncInit = () => {
          if (typeof previousInit === 'function') {
            previousInit();
          }
          initialize();
        };

        const handleError = () => {
          facebookSdkPromise = null;
          reject(new Error('Failed to load Facebook SDK.'));
        };

        if (existingScript) {
          existingScript.addEventListener(
            'load',
            () => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any).fbAsyncInit?.();
            },
            { once: true },
          );
          existingScript.addEventListener('error', handleError, { once: true });
          return;
        }

        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.async = true;
        script.defer = true;
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.onerror = handleError;
        document.head.appendChild(script);
      });
    }

    return facebookSdkPromise;
  };

  const renderGoogleButton = async (
    container: HTMLElement,
    onCredential: (credential: string) => void,
  ): Promise<void> => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
      | string
      | undefined;
    if (!clientId) {
      throw new Error(
        'Google sign-in is not configured. Please set VITE_GOOGLE_CLIENT_ID.',
      );
    }

    const google = await loadGoogleIdentityServices();
    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential?: string }) => {
        if (!response.credential) {
          return;
        }
        onCredential(response.credential);
      },
    });

    container.replaceChildren();
    google.accounts.id.renderButton(container, {
      theme: 'filled_blue',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      logo_alignment: 'left',
      width: Math.max(Math.min(Math.round(container.getBoundingClientRect().width || 320), 400), 240),
    });
  };

  const lookupGoogleAccount = async (credential: string) => {
    return authApi.googleLookup({ credential });
  };

  const getFacebookAccessToken = async (): Promise<string> => {
    const FB = await loadFacebookSdk();
    return new Promise((resolve, reject) => {
      FB.login(
        (response: { authResponse?: { accessToken?: string } }) => {
          const token = response.authResponse?.accessToken;
          if (!token) {
            reject(
              new Error(
                'Facebook sign-in was cancelled or could not be completed.',
              ),
            );
            return;
          }
          resolve(token);
        },
        { scope: 'email,public_profile' },
      );
    });
  };

  const lookupFacebookAccount = async (accessToken: string) => {
    return authApi.facebookLookup({ access_token: accessToken });
  };

  const completeGoogleSignIn = async (
    credential: string,
    role = 'learner',
  ): Promise<void> => {
    const result = await authApi.googleLogin({
      credential,
      role: getSocialSignupRole(role),
    });
    applyAuthResult(result);
  };

  const completeFacebookSignIn = async (
    accessToken: string,
    role = 'learner',
  ): Promise<void> => {
    const result = await authApi.facebookLogin({
      access_token: accessToken,
      role: getSocialSignupRole(role),
    });
    applyAuthResult(result);
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
        isFirstLogin,
        loading,
        signIn,
        signUp,
        signOut,
        renderGoogleButton,
        getFacebookAccessToken,
        lookupGoogleAccount,
        lookupFacebookAccount,
        completeGoogleSignIn,
        completeFacebookSignIn,
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
