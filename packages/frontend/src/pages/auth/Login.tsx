import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      addNotification('success', 'Successfully logged in!');

      // Navigate to the attempted route or default to projects
      const from = (location.state as { from?: string })?.from || '/projects';
      navigate(from, { replace: true });
    } catch (error) {
      addNotification('error', 'Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="card p-6">
          <h1 className="card-header">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="input"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="link">
              Forgot Password?
            </Link>
          </div>
          <div className="mt-4 text-center">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="link">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
