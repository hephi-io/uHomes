import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { token } from '@/utils';
import { getCurrentUser, type TUser } from '@/services/auth';

interface AuthContextType {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokenValue: string, userData: TUser) => void;
  logout: () => void;
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

  const logout = () => {
    token.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const { data } = await getCurrentUser();
      setUser(data.data);
    } catch (error) {
      console.error('Error refreshing user:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!token.getToken(),
    isLoading,
    login,
    logout,
    setUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
