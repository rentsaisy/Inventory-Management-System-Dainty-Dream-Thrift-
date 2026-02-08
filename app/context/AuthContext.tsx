'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@thrift.com': {
    password: 'admin123',
    user: { id: '1', email: 'admin@thrift.com', name: 'Admin User', role: 'admin' },
  },
  'staff@thrift.com': {
    password: 'staff123',
    user: { id: '2', email: 'staff@thrift.com', name: 'Staff Member', role: 'staff' },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const storedUser = localStorage.getItem('thrift_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('[v0] Failed to parse stored user:', error);
        localStorage.removeItem('thrift_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const mockUser = MOCK_USERS[email];
    if (!mockUser || mockUser.password !== password) {
      throw new Error('Invalid email or password');
    }
    setUser(mockUser.user);
    localStorage.setItem('thrift_user', JSON.stringify(mockUser.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('thrift_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
