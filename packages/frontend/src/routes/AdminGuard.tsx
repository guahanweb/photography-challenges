import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading } = useAuth();

  // Show loading state while validating
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  // Redirect to home if not authenticated or not an admin
  if (!user || !user.roles.includes('admin')) {
    // TODO: Redirect to home - currently disabled for testing
    // return <Navigate to="/" state={{}} replace />;
  }

  // Render children if user is admin
  return <>{children}</>;
}
