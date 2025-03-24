import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { resetPassword } = useAuth();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      addNotification('success', 'Password reset instructions sent to your email.');
    } catch (error) {
      addNotification('error', 'Failed to send reset instructions. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="card p-6">
          <h1 className="card-header">Reset Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Send Reset Link
            </button>
          </form>
          <div className="mt-4 text-center">
            Remember your password?{' '}
            <Link to="/login" className="link">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
