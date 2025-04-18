"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from './api';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  [key: string]: any; // For any additional user properties
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  pendingVerification: boolean;
  pendingEmail: string;
  register: (userData: { username: string; password: string; email: string; fullName: string }) => Promise<any>;
  verifyEmail: (email: string, otp: string) => Promise<any>;
  login: (credentials: { username: string; password: string }) => Promise<any>;
  verifyLogin: (email: string, otp: number) => Promise<User>;
  logout: () => Promise<void>;
  error: string | null;
}

// Create authentication context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Context provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // Check for existing session on initial load
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Update auth headers for API calls with token
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to restore authentication session', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Register function
  const register = async (userData: { username: string; password: string; email: string; fullName: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.register(userData);
      
      // Set pending verification state
      setPendingVerification(true);
      setPendingEmail(userData.email);
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify email function
  const verifyEmail = async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.verifyEmail({ email, otp });
      
      // Reset verification state
      setPendingVerification(false);
      setPendingEmail('');
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Email verification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login(credentials);
      
      // Set pending verification state for OTP
      setPendingVerification(true);
      setPendingEmail(response.email || '');
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify login OTP function
  const verifyLogin = async (email: string, otp: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.verifyLogin({ email, otp });
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      // Reset verification state
      setPendingVerification(false);
      setPendingEmail('');
      
      setUser(response.user);
      return response.user;
    } catch (err: any) {
      setError(err.message || 'Login verification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Call logout API if server-side session needs to be invalidated
      await authAPI.logout().catch(err => console.error('Logout API error:', err));
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      setIsLoading(false);
    }
  };

  // Provide authentication context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    pendingVerification,
    pendingEmail,
    register,
    verifyEmail,
    login,
    verifyLogin,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};