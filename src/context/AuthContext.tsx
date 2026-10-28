import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/index.ts';
import { dbStore, INITIAL_PROFILES } from '../services/store.ts';

interface AuthContextType {
  currentUser: UserProfile;
  activeRole: UserRole;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  loginWithEmail: (email: string) => boolean;
  logout: () => void;
  allProfiles: UserProfile[];
  isDemoMode: boolean;
}

const AUTH_STORAGE_KEY = 'inspectra_active_user_id';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const allProfiles = dbStore.getProfiles();
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedId = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedId) {
        const found = allProfiles.find(p => p.id === savedId);
        if (found) return found;
      }
    } catch {
      // ignore
    }
    // Default to Admin
    return allProfiles[0] || INITIAL_PROFILES[0];
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, currentUser.id);
    } catch {
      // ignore
    }
  }, [currentUser]);

  const switchUser = (userId: string) => {
    const user = allProfiles.find(p => p.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const switchRole = (role: UserRole) => {
    const user = allProfiles.find(p => p.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  const loginWithEmail = (email: string): boolean => {
    const user = allProfiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    // Reset to public/admin view
    setCurrentUser(allProfiles[0]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole: currentUser.role,
        switchUser,
        switchRole,
        loginWithEmail,
        logout,
        allProfiles,
        isDemoMode: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
