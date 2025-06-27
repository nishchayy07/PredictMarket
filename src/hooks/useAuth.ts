import { useState, useEffect } from 'react';
import { User } from '../types';

const DEMO_USER: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  walletBalance: 10000,
  totalPnL: 250,
  rank: 42,
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(DEMO_USER);
        localStorage.setItem('currentUser', JSON.stringify(DEMO_USER));
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const login = (email: string, password: string) => {
    // Simulate login
    setUser(DEMO_USER);
    localStorage.setItem('currentUser', JSON.stringify(DEMO_USER));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return { user, isLoading, updateUser, login, logout };
};