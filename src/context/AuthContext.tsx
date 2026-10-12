import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Farmer } from '../types';
import { StorageService } from '../db/storage';

interface AuthContextType {
  currentUser: User | null;
  currentFarmer: Farmer | null;
  login: (email: string) => boolean;
  loginAs: (rolePreset: 'farmer_ramesh' | 'consumer_priya' | 'admin' | 'farmer_pending') => void;
  logout: () => void;
  register: (params: {
    name: string;
    email: string;
    role: 'consumer' | 'farmer';
    farm_name?: string;
    location?: string;
    phone?: string;
    pincodes?: string[];
  }) => { user: User; farmer?: Farmer };
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentFarmer, setCurrentFarmer] = useState<Farmer | null>(null);

  const syncFarmer = (user: User | null) => {
    if (user && user.role === 'farmer') {
      const farmer = StorageService.getFarmerByUserId(user.user_id);
      setCurrentFarmer(farmer || null);
    } else {
      setCurrentFarmer(null);
    }
  };

  useEffect(() => {
    // Default to Consumer Priya for immediate interactive browsing
    const defaultUser = StorageService.getUserByEmail('priya@gmail.com') || StorageService.getUsers()[0];
    if (defaultUser) {
      setCurrentUser(defaultUser);
      syncFarmer(defaultUser);
    }
  }, []);

  const login = (email: string): boolean => {
    const user = StorageService.getUserByEmail(email);
    if (!user) {
      throw new Error('No user found with that email address.');
    }
    if (!user.is_active) {
      throw new Error('This account has been suspended by the marketplace administrator.');
    }
    setCurrentUser(user);
    syncFarmer(user);
    return true;
  };

  const loginAs = (preset: 'farmer_ramesh' | 'consumer_priya' | 'admin' | 'farmer_pending') => {
    let email = '';
    switch (preset) {
      case 'farmer_ramesh':
        email = 'ramesh@farmertoconsumer.local';
        break;
      case 'consumer_priya':
        email = 'priya@gmail.com';
        break;
      case 'admin':
        email = 'admin@farmertoconsumer.local';
        break;
      case 'farmer_pending':
        email = 'gurpreet@doaborganics.in';
        break;
    }
    const user = StorageService.getUserByEmail(email);
    if (user) {
      setCurrentUser(user);
      syncFarmer(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentFarmer(null);
  };

  const register = (params: Parameters<typeof StorageService.registerUser>[0]) => {
    const res = StorageService.registerUser(params);
    setCurrentUser(res.user);
    if (res.farmer) {
      setCurrentFarmer(res.farmer);
    } else {
      setCurrentFarmer(null);
    }
    return res;
  };

  const refreshUser = () => {
    if (currentUser) {
      const refreshed = StorageService.getUserById(currentUser.user_id);
      if (refreshed) {
        setCurrentUser(refreshed);
        syncFarmer(refreshed);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentFarmer,
      login,
      loginAs,
      logout,
      register,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
