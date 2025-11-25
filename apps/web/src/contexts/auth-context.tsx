import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { token } from '@/utils';
import { getCurrentUser, logout as logoutApi, type TUser } from '@/services/auth';

interface AuthContextType {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  login: (tokenValue: string, userData: TUser) => void;
  logout: (onComplete?: () => void) => Promise<void>;
  setUser: (user: TUser | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = token.getToken();
      if (storedToken) {
        try {
          // Fetch current user data
          const { data } = await getCurrentUser();
          setUser(data.data);
        } catch (error) {
          console.error('Error checking auth:', error);
          // Token is invalid, clear it
          token.logout();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (tokenValue: string, userData: TUser) => {
    token.login(tokenValue);
    setUser(userData);
  };

  const logout = async (onComplete?: () => void) => {
    setIsLoggingOut(true);
    try {
      // Try to call logout API, but don't fail if it errors (offline support)
      try {
        await logoutApi();
      } catch (error) {
        // Network error or token already invalid - still proceed with local logout
        console.warn('Logout API call failed, proceeding with local logout:', error);
      }
    } finally {
      // Always clear local state regardless of API call result
      token.clearAll();
      setUser(null);
      setIsLoggingOut(false);

      // Execute callback if provided (e.g., for navigation)
      if (onComplete) {
        onComplete();
      }
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await getCurrentUser();
      setUser(data.data);
    } catch (error) {
      console.error('Error refreshing user:', error);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!token.getToken(),
    isLoading,
    isLoggingOut,
    login,
    logout,
    setUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
