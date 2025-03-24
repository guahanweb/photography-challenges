import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { AuthState, AuthContextType, User, UserRole } from '../types/auth';
import { auth } from '../api/client';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ROLES'; payload: UserRole[] };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  console.log('[AuthContext] State update:', { action: action.type, payload: action.payload });
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ROLES':
      return {
        ...state,
        user: state.user ? { ...state.user, roles: action.payload } : null,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const initialLoad = useRef(true);

  // Check for existing token on mount
  useEffect(() => {
    const validateExistingToken = async () => {
      const token = localStorage.getItem('token');
      console.log('[AuthContext] Checking for existing token:', !!token);
      if (token) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          console.log('[AuthContext] Starting token validation');
          const userData = await auth.validateToken();
          console.log('[AuthContext] Token validation successful:', userData);
          dispatch({ type: 'SET_USER', payload: userData });
        } catch (error) {
          console.error('[AuthContext] Token validation failed:', error);
          auth.logout();
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    if (initialLoad.current) {
      validateExistingToken();
      initialLoad.current = false;
    }
  }, []); // Empty dependency array to run only on mount

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { token } = await auth.login(email, password);
      const userData = await auth.validateToken();
      dispatch({ type: 'SET_USER', payload: userData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Login failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const logout = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      auth.logout();
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Logout failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { token } = await auth.register(email, password);
      const userData = await auth.validateToken();
      dispatch({ type: 'SET_USER', payload: userData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Registration failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // TODO: Implement password reset
      throw new Error('Not implemented');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Password reset failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const setRoles = useCallback((roles: UserRole[]) => {
    dispatch({ type: 'SET_ROLES', payload: roles });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        resetPassword,
        setRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
