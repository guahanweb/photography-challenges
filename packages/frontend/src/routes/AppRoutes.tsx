import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthGuard } from './AuthGuard';
import { NoAuthGuard } from './NoAuthGuard';
import { AdminGuard } from './AdminGuard';
import { AdminLayout } from '../components/layout/AdminLayout';

// Pages
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import { Projects } from '../pages/projects/Projects';
import { ProjectDetail } from '../pages/projects/ProjectDetail';
import { Profile } from '../pages/Profile';
import { Settings } from '../pages/Settings';
import { NotFound } from '../pages/NotFound';

// Admin Pages
import { Users } from '../pages/admin/users/Users';
import { Projects as AdminProjects } from '../pages/admin/projects/Projects';
import { ProjectForm } from '../pages/admin/projects/ProjectForm';
import { Settings as AdminSettings } from '../pages/admin/settings/Settings';

export function AppRoutes() {
  return (
    <Routes>
      {/* Unauthenticated routes */}
      <Route
        element={
          <NoAuthGuard>
            <Outlet />
          </NoAuthGuard>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Authenticated routes */}
      <Route
        element={
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        }
      >
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout>
              <Outlet />
            </AdminLayout>
          </AdminGuard>
        }
      >
        <Route index element={<Navigate to="/admin/projects" replace />} />
        <Route path="users" element={<Users />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id/edit" element={<ProjectForm />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Public routes - no guard */}
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
