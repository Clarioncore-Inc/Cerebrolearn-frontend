import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'learner' | 'instructor' | 'org_admin' | 'admin' | 'psychologist' | 'psychologist_pending';
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
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = async (userId: string) => {
    try {
      // In offline mode, skip session check and use userId directly
      const profile = {
        id: userId,
        full_name: 'Demo User',
        email: 'demo@cerebrolearn.com',
        role: 'instructor',
        xp: 1250,
        level: 5,
        streak: 7,
        badges: []
      };
      setProfile(profile);
    } catch (error) {
      console.log('Error fetching profile, using default');
      setProfile(null);
    }
  };

  useEffect(() => {
    // Offline mode: Skip real auth session checks to prevent refresh token errors
    const initializeOfflineAuth = async () => {
      try {
        // Check localStorage for existing mock session
        const mockSession = localStorage.getItem('mock_auth_session');
        
        if (mockSession) {
          const session = JSON.parse(mockSession);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.log('[Auth] Error in offline mode initialization:', error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initializeOfflineAuth();

    // Set up auth state change listener (for sign in/out)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mock_auth_session') {
        if (e.newValue) {
          const session = JSON.parse(e.newValue);
          setUser(session.user);
          fetchProfile(session.user.id);
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
    // Offline mode: Mock authentication
    console.log('[Auth] Mock sign in:', email);
    
    // Create mock user
    const mockUser = {
      id: `user-${Date.now()}`,
      email,
      app_metadata: {},
      user_metadata: { full_name: 'Demo User' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;

    // Create mock profile based on email
    let role: 'learner' | 'instructor' | 'org_admin' | 'admin' | 'psychologist' | 'psychologist_pending' = 'learner';
    if (email.includes('instructor')) role = 'instructor';
    if (email.includes('admin')) role = 'admin';

    const mockProfile = {
      id: mockUser.id,
      email,
      full_name: 'Demo User',
      role,
      org_id: null,
      avatar: null,
      xp: 1250,
      streak: 7,
      badges: [],
      created_at: new Date().toISOString()
    };

    // Store in state
    setUser(mockUser);
    setProfile(mockProfile);

    // Store in localStorage
    const mockSession = {
      user: mockUser,
      access_token: `mock_token_${Date.now()}`,
      refresh_token: `mock_refresh_${Date.now()}`
    };
    localStorage.setItem('mock_auth_session', JSON.stringify(mockSession));
    localStorage.setItem(`cerebrolearn_profile_${mockUser.id}`, JSON.stringify(mockProfile));
  };

  const signUp = async (email: string, password: string, fullName: string, role = 'learner') => {
    // Offline mode: Mock signup
    console.log('[Auth] Mock sign up:', email, fullName, role);
    
    const mockUser = {
      id: `user-${Date.now()}`,
      email,
      app_metadata: {},
      user_metadata: { full_name: fullName, role },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;

    const mockProfile = {
      id: mockUser.id,
      email,
      full_name: fullName,
      role: role as 'learner' | 'instructor' | 'org_admin' | 'admin' | 'psychologist' | 'psychologist_pending',
      org_id: null,
      avatar: null,
      xp: 0,
      streak: 0,
      badges: [],
      created_at: new Date().toISOString()
    };

    // Store in state
    setUser(mockUser);
    setProfile(mockProfile);

    // Store in localStorage
    const mockSession = {
      user: mockUser,
      access_token: `mock_token_${Date.now()}`,
      refresh_token: `mock_refresh_${Date.now()}`
    };
    localStorage.setItem('mock_auth_session', JSON.stringify(mockSession));
    localStorage.setItem(`cerebrolearn_profile_${mockUser.id}`, JSON.stringify(mockProfile));

    return { user: mockUser, error: null };
  };

  const signOut = async () => {
    // Offline mode: Mock sign out
    console.log('[Auth] Mock sign out');
    
    setUser(null);
    setProfile(null);
    localStorage.removeItem('mock_auth_session');
  };

  const signInWithGoogle = async () => {
    // Offline mode: Mock Google sign in
    console.log('[Auth] Mock Google sign in');
    
    const mockUser = {
      id: `google-user-${Date.now()}`,
      email: 'google@cerebrolearn.com',
      app_metadata: {},
      user_metadata: { full_name: 'Google User' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;

    const mockProfile = {
      id: mockUser.id,
      email: mockUser.email,
      full_name: 'Google User',
      role: 'learner' as const,
      org_id: null,
      avatar: null,
      xp: 0,
      streak: 0,
      badges: [],
      created_at: new Date().toISOString()
    };

    setUser(mockUser);
    setProfile(mockProfile);

    const mockSession = {
      user: mockUser,
      access_token: `mock_token_${Date.now()}`,
      refresh_token: `mock_refresh_${Date.now()}`
    };
    localStorage.setItem('mock_auth_session', JSON.stringify(mockSession));
    localStorage.setItem(`cerebrolearn_profile_${mockUser.id}`, JSON.stringify(mockProfile));
  };

  const signInWithFacebook = async () => {
    // Offline mode: Mock Facebook sign in
    console.log('[Auth] Mock Facebook sign in');
    
    const mockUser = {
      id: `facebook-user-${Date.now()}`,
      email: 'facebook@cerebrolearn.com',
      app_metadata: {},
      user_metadata: { full_name: 'Facebook User' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;

    const mockProfile = {
      id: mockUser.id,
      email: mockUser.email,
      full_name: 'Facebook User',
      role: 'learner' as const,
      org_id: null,
      avatar: null,
      xp: 0,
      streak: 0,
      badges: [],
      created_at: new Date().toISOString()
    };

    setUser(mockUser);
    setProfile(mockProfile);

    const mockSession = {
      user: mockUser,
      access_token: `mock_token_${Date.now()}`,
      refresh_token: `mock_refresh_${Date.now()}`
    };
    localStorage.setItem('mock_auth_session', JSON.stringify(mockSession));
    localStorage.setItem(`cerebrolearn_profile_${mockUser.id}`, JSON.stringify(mockProfile));
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      signInWithGoogle,
      signInWithFacebook,
      refreshProfile
    }}>
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