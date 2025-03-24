import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Challenges from '../pages/challenges/Challenges';
import ChallengeDetail from '../pages/challenges/ChallengeDetail';
import { Profile } from '../pages/Profile';
import { Settings } from '../pages/Settings';
import { NotFound } from '../pages/NotFound';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import { useAuth } from '../contexts/AuthContext';

interface RouteWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectIfAuthenticated?: string;
}

function RouteWrapper({ children, requireAuth, redirectIfAuthenticated }: RouteWrapperProps) {
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

  // Redirect if authenticated and redirectIfAuthenticated is specified
  if (redirectIfAuthenticated && user) {
    // Use the return path from state if available, otherwise use the default redirect
    const returnPath = (location.state as { from?: string })?.from || redirectIfAuthenticated;
    return <Navigate to={returnPath} replace state={{}} />;
  }

  // Redirect to login if not authenticated and requireAuth is true
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Neutral case - render children
  return <>{children}</>;
}

// Route group components
function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  return <RouteWrapper requireAuth>{children}</RouteWrapper>;
}

function UnauthenticatedRoute({ children }: { children: React.ReactNode }) {
  return <RouteWrapper redirectIfAuthenticated="/">{children}</RouteWrapper>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Unauthenticated routes (login, register, etc.) */}
      <Route
        path="/login"
        element={
          <UnauthenticatedRoute>
            <Login />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <UnauthenticatedRoute>
            <Register />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <UnauthenticatedRoute>
            <ForgotPassword />
          </UnauthenticatedRoute>
        }
      />

      {/* Authenticated routes */}
      <Route
        path="/"
        element={
          <AuthenticatedRoute>
            <Home />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/challenges"
        element={
          <AuthenticatedRoute>
            <Challenges />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/challenges/:id"
        element={
          <AuthenticatedRoute>
            <ChallengeDetail />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthenticatedRoute>
            <Profile />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <AuthenticatedRoute>
            <Settings />
          </AuthenticatedRoute>
        }
      />

      {/* Public routes (no auth required) */}
      <Route
        path="*"
        element={
          <PublicRoute>
            <NotFound />
          </PublicRoute>
        }
      />
    </Routes>
  );
}
