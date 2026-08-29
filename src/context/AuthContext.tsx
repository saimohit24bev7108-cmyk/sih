import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'customer' | 'worker' | 'admin';

interface AuthState {
  isLoggedIn: boolean;
  role: UserRole | null;
  userName: string;
}

interface AuthContextType extends AuthState {
  login: (role: UserRole, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    role: null,
    userName: '',
  });

  const login = (role: UserRole, name?: string) => {
    setAuth({
      isLoggedIn: true,
      role,
      userName: name || (role === 'admin' ? 'Admin User' : role === 'worker' ? 'Rajesh Kumar' : 'Priya Sharma'),
    });
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, role: null, userName: '' });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
