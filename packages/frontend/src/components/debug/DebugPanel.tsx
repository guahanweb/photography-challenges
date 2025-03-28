import React, { useState, useEffect, useCallback } from 'react';
import { FiSettings, FiX, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import { ToggleSwitch } from '../forms/ToggleSwitch';
import { useDebug } from '../../contexts/DebugContext';
import { DebugSection } from './DebugSection';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, setSystemPreference, preferences } = useTheme();
  const { user, logout, setRoles } = useAuth();
  const { activeForm, saveFormState, loadFormState } = useDebug();
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [useSystemTheme, setUseSystemTheme] = useState(preferences.systemPreference);

  useEffect(() => {
    if (user?.roles) {
      setSelectedRoles(user.roles);
    }
  }, [user]);

  useEffect(() => {
    setUseSystemTheme(preferences.systemPreference);
  }, [preferences.systemPreference]);

  const handleRoleToggle = useCallback(
    (role: UserRole) => {
      setSelectedRoles(prevRoles => {
        const newRoles = prevRoles.includes(role)
          ? prevRoles.filter(r => r !== role)
          : [...prevRoles, role];
        setRoles(newRoles);
        return newRoles;
      });
    },
    [setRoles]
  );

  const handleThemeToggle = useCallback(
    (currentTheme: string) => {
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    },
    [setTheme]
  );

  const handleSystemPreferenceToggle = useCallback(
    (checked: boolean) => {
      setUseSystemTheme(checked);
      setSystemPreference(checked);
    },
    [setSystemPreference]
  );

  const togglePanel = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={togglePanel}
        className="btn-secondary p-3 rounded-full shadow-lg"
        aria-label="Debug Panel"
      >
        <FiSettings className="w-6 h-6" />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 min-w-[480px] bg-surface-light dark:bg-surface-dark rounded-lg shadow-xl p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-primary">Debug Panel</h3>
            <button onClick={togglePanel} className="text-secondary hover:text-primary">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form State Section */}
          <DebugSection title="Form State">
            {activeForm ? (
              <>
                <div className="text-sm text-secondary mb-2">
                  Active Form: <span className="font-mono">{activeForm.id}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveFormState} className="btn-primary text-sm flex-1">
                    Save State
                  </button>
                  <button onClick={loadFormState} className="btn-secondary text-sm flex-1">
                    Load State
                  </button>
                </div>
              </>
            ) : (
              <div className="text-sm text-secondary italic">No form currently registered</div>
            )}
          </DebugSection>

          {/* Auth Controls */}
          <DebugSection title="Auth">
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
          </DebugSection>

          {/* Role Controls */}
          <DebugSection title="Roles">
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
          </DebugSection>

          {/* Theme Controls */}
          <DebugSection title="Theme" showBorder={false}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center space-x-2 text-sm text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useSystemTheme}
                    onChange={e => handleSystemPreferenceToggle(e.target.checked)}
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
                    onChange={() => handleThemeToggle(theme)}
                  />
                </label>
              </div>
            </div>
          </DebugSection>
        </div>
      )}
    </div>
  );
}
