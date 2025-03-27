import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NoAuthGuardProps {
  children: React.ReactNode;
}

export function NoAuthGuard({ children }: NoAuthGuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while validating
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  // Redirect to projects if authenticated
  if (user) {
    return <Navigate to="/projects" replace state={{}} />;
  }

  // Render children if not authenticated
  return <>{children}</>;
}
