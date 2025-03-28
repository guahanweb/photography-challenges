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
    console.log('[DebugContext] Registering form:', form.id);
    setActiveForm(form);
  }, []);

  const unregisterForm = useCallback((id: string) => {
    console.log('[DebugContext] Unregistering form:', id);
    setActiveForm(current => (current?.id === id ? null : current));
  }, []);

  const saveFormState = useCallback(() => {
    if (!activeForm) {
      console.warn('[DebugContext] No active form to save state from');
      return;
    }

    try {
      const state = activeForm.getState();
      localStorage.setItem(`${STORAGE_PREFIX}${activeForm.id}`, JSON.stringify(state));
      console.log('[DebugContext] Saved form state:', activeForm.id);
    } catch (error) {
      console.error('[DebugContext] Error saving form state:', error);
    }
  }, [activeForm]);

  const loadFormState = useCallback(() => {
    if (!activeForm) {
      console.warn('[DebugContext] No active form to load state into');
      return;
    }

    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${activeForm.id}`);
      if (!stored) {
        console.warn('[DebugContext] No stored state found for form:', activeForm.id);
        return;
      }

      const state = JSON.parse(stored);
      activeForm.setState(state);
      console.log('[DebugContext] Loaded form state:', activeForm.id);
    } catch (error) {
      console.error('[DebugContext] Error loading form state:', error);
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
