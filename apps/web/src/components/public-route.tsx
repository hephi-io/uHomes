import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import type { ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Redirect authenticated users to their dashboard based on user type
    const userType = user.userType?.type;

    if (userType === 'agent') {
      return <Navigate to="/agent-dashboard" replace />;
    } else if (userType === 'student') {
      return <Navigate to="/students/dashboard" replace />;
    } else {
      // Default fallback (shouldn't happen, but handle it)
      return <Navigate to="/agent-dashboard" replace />;
    }
  }

  // User is not authenticated, show auth pages
  return <>{children}</>;
};
