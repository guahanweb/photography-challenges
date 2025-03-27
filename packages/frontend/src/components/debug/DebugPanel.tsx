import React, { useState, useEffect } from 'react';
import { FiSettings, FiX, FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import { ToggleSwitch } from '../forms/ToggleSwitch';
import { useDebug } from '../../contexts/DebugContext';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, setSystemPreference, preferences } = useTheme();
  const { user, logout, setRoles } = useAuth();
  const { saveFormState, loadFormState, isFormBound } = useDebug();
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);

  // Update selected roles when user changes
  useEffect(() => {
    if (user?.roles) {
      setSelectedRoles(user.roles);
    }
  }, [user]);

  const handleRoleToggle = (role: UserRole) => {
    const newRoles = selectedRoles.includes(role)
      ? selectedRoles.filter(r => r !== role)
      : [...selectedRoles, role];
    setSelectedRoles(newRoles);
    setRoles(newRoles);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary p-3 rounded-full shadow-lg"
        aria-label="Debug Panel"
      >
        <FiSettings className="w-6 h-6" />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-surface-light dark:bg-surface-dark rounded-lg shadow-xl p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-primary">Debug Panel</h3>
            <button onClick={() => setIsOpen(false)} className="text-secondary hover:text-primary">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form State Controls */}
          <div className="space-y-2 mb-6 pb-6 border-b border-surface-dark dark:border-surface-light">
            <h4 className="text-base font-medium text-secondary mb-2">Form State</h4>
            <div className="flex gap-2">
              <button
                onClick={saveFormState}
                disabled={!isFormBound}
                className={`btn-primary text-sm flex-1 ${!isFormBound ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Save State
              </button>
              <button
                onClick={loadFormState}
                disabled={!isFormBound}
                className={`btn-secondary text-sm flex-1 ${!isFormBound ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Load State
              </button>
            </div>
          </div>

          {/* Auth Controls */}
          <div className="space-y-6 mb-6 pb-6 border-b border-surface-dark dark:border-surface-light">
            <div>
              <h4 className="text-base font-medium text-secondary mb-2">Auth</h4>
              <div className="space-y-2">
                {user ? (
                  <>
                    <div className="text-sm text-secondary">Logged in as: {user.email}</div>
                    <button
                      onClick={logout}
                      className="btn-secondary flex items-center space-x-2 text-sm"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="text-sm text-secondary">Not logged in</div>
                )}
              </div>
            </div>

            {/* Role Controls */}
            <div>
              <h4 className="text-base font-medium text-secondary mb-2">Roles</h4>
              <div className="space-y-2">
                {(['admin', 'mentor', 'photographer'] as UserRole[]).map(role => (
                  <label
                    key={role}
                    className="flex items-center justify-between text-sm text-secondary cursor-pointer"
                  >
                    <span className="capitalize">{role}</span>
                    <ToggleSwitch
                      checked={selectedRoles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Theme Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-medium text-secondary">Theme</h4>
                <label className="flex items-center space-x-2 text-sm text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.systemPreference}
                    onChange={e => setSystemPreference(e.target.checked)}
                    className="rounded text-primary-light focus:ring-primary-light cursor-pointer"
                  />
                  <span>Use System Theme</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm text-secondary cursor-pointer">
                  <span>Dark Mode</span>
                  <ToggleSwitch
                    checked={theme === 'dark'}
                    onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
