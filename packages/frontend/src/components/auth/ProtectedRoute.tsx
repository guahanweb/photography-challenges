import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  console.log('[ProtectedRoute]', user, location.pathname);

  // Show loading state while validating
  if (isLoading) {
    console.log('[ProtectedRoute] Still loading, showing spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  // If not authenticated and not on login page, redirect to login with return path
  if (!user && location.pathname !== '/login') {
    console.log('[ProtectedRoute] Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated and on login page, redirect to home
  if (user && location.pathname === '/login') {
    console.log('[ProtectedRoute] Already authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
