import React, { useState } from 'react';
import { FiSettings, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, setSystemPreference, preferences } = useTheme();

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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-primary">Debug Panel</h3>
            <button onClick={() => setIsOpen(false)} className="text-secondary hover:text-primary">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Theme Controls */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-secondary mb-2">Theme</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`btn-secondary ${theme === 'light' ? 'ring-2 ring-primary-light' : ''}`}
                >
                  <FiSun className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`btn-secondary ${theme === 'dark' ? 'ring-2 ring-primary-light' : ''}`}
                >
                  <FiMoon className="w-5 h-5" />
                </button>
                <label className="flex items-center space-x-2 text-sm text-secondary">
                  <input
                    type="checkbox"
                    checked={preferences.systemPreference}
                    onChange={e => setSystemPreference(e.target.checked)}
                    className="rounded text-primary-light focus:ring-primary-light"
                  />
                  <span>Use System Theme</span>
                </label>
              </div>
            </div>

            {/* Add more debug controls here as needed */}
          </div>
        </div>
      )}
    </div>
  );
}
