import React, { createContext, useContext, useState, useCallback } from 'react';

interface DebugContextType {
  bindDebugForm: (key: string, getState: () => any, loadState: (state: any) => void) => void;
  unbindDebugForm: () => void;
  saveFormState: () => void;
  loadFormState: () => void;
  isFormBound: boolean;
  // ... other existing debug context properties
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: React.ReactNode }) {
  // ... other existing state
  const [currentFormKey, setCurrentFormKey] = useState<string | null>(null);
  const [getFormState, setGetFormState] = useState<(() => any) | null>(null);
  const [setFormState, setSetFormState] = useState<((state: any) => void) | null>(null);

  const bindDebugForm = useCallback(
    (key: string, getState: () => any, loadState: (state: any) => void) => {
      // Memoize all values
      setCurrentFormKey(key);
      setGetFormState(() => getState);
      setSetFormState(() => loadState);
    },
    []
  ); // Empty dependency array ensures the binding function remains stable

  const unbindDebugForm = useCallback(() => {
    setCurrentFormKey(null);
    setGetFormState(null);
    setSetFormState(null);
  }, []);

  const isFormBound = currentFormKey !== null && getFormState !== null && setFormState !== null;

  const saveFormState = useCallback(() => {
    if (!currentFormKey || !getFormState) {
      console.error('Cannot save form state: no form binding initialized');
      return;
    }

    try {
      const state = getFormState();
      const serializedState = JSON.stringify(state);
      console.log('Saving form state:', currentFormKey, serializedState);
      localStorage.setItem(`debug_form_${currentFormKey}`, serializedState);
    } catch (err) {
      console.error('Failed to save form state:', err);
    }
  }, [currentFormKey, getFormState]);

  const loadFormState = useCallback(() => {
    if (!currentFormKey || !setFormState) {
      console.error('Cannot load form state: no form binding initialized');
      return;
    }

    try {
      const serializedState = localStorage.getItem(`debug_form_${currentFormKey}`);
      if (serializedState === null) {
        return;
      }
      const state = JSON.parse(serializedState);
      console.log('Loading form state:', currentFormKey, state);
      setFormState(state);
    } catch (err) {
      console.error('Failed to load form state:', err);
    }
  }, [currentFormKey, setFormState]);

  const value = {
    bindDebugForm,
    unbindDebugForm,
    saveFormState,
    loadFormState,
    isFormBound,
    // ... other existing context values
  };

  return <DebugContext.Provider value={value}>{children}</DebugContext.Provider>;
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
}
