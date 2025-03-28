import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface DebugForm {
  id: string;
  getState: () => any;
  setState: (state: any) => void;
}

interface DebugContextType {
  activeForm: DebugForm | null;

  registerForm: (form: DebugForm) => void;
  unregisterForm: (id: string) => void;
  saveFormState: () => void;
  loadFormState: () => void;
}

const STORAGE_PREFIX = 'debug_form_state_';

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: React.ReactNode }) {
  const [activeForm, setActiveForm] = useState<DebugForm | null>(null);

  const registerForm = useCallback((form: DebugForm) => {
    setActiveForm(form);
  }, []);

  const unregisterForm = useCallback((id: string) => {
    setActiveForm(current => (current?.id === id ? null : current));
  }, []);

  const saveFormState = useCallback(() => {
    if (!activeForm) {
      return;
    }

    try {
      const state = activeForm.getState();
      localStorage.setItem(`${STORAGE_PREFIX}${activeForm.id}`, JSON.stringify(state));
    } catch (error) {
      // Silent fail - debug functionality should not interrupt normal operation
    }
  }, [activeForm]);

  const loadFormState = useCallback(() => {
    if (!activeForm) {
      return;
    }

    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${activeForm.id}`);
      if (!stored) {
        return;
      }

      const state = JSON.parse(stored);
      activeForm.setState(state);
    } catch (error) {
      // Silent fail - debug functionality should not interrupt normal operation
    }
  }, [activeForm]);

  const value = {
    activeForm,
    registerForm,
    unregisterForm,
    saveFormState,
    loadFormState,
  };

  return <DebugContext.Provider value={value}>{children}</DebugContext.Provider>;
}

export function useDebugForm(config: DebugForm) {
  const { registerForm, unregisterForm } = useDebug();

  useEffect(() => {
    registerForm({
      id: config.id,
      getState: config.getState,
      setState: config.setState,
    });

    return () => unregisterForm(config.id);
  }, [config.id, config.getState, config.setState, registerForm, unregisterForm]);
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
}
