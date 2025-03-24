export type UserRole = 'admin' | 'mentor' | 'photographer';

export interface User {
  email: string;
  roles: UserRole[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setRoles: (roles: UserRole[]) => void;
}
