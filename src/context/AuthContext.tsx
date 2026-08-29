import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'customer' | 'worker' | 'admin';

interface AuthState {
  isLoggedIn: boolean;
  role: UserRole | null;
  userName: string;
}

interface LoginPayload {
  email?: string;
  password?: string;
  phone_number?: string;
  code?: string;
  role?: UserRole;
  name?: string;
}

interface AuthContextType extends AuthState {
  login: (role: UserRole, payload?: string | LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
let accessTokenMemory: string | null = null;
let refreshTokenMemory: string | null = null;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function apiFetch<T>(path: string, payload?: Record<string, unknown>): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessTokenMemory) {
    headers.Authorization = `Bearer ${accessTokenMemory}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data?.detail ?? data?.message ?? data?.error ?? 'Request failed';
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
  }

  return data as T;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    role: null,
    userName: '',
  });

  const setAuthenticatedState = (role: UserRole, userName: string, accessToken: string, refreshToken: string) => {
    accessTokenMemory = accessToken;
    refreshTokenMemory = refreshToken;

    setAuth({
      isLoggedIn: true,
      role,
      userName,
    });
  };

  const login = async (role: UserRole, payload?: string | LoginPayload) => {
    if (typeof payload === 'string') {
      setAuth({
        isLoggedIn: true,
        role,
        userName: payload || (role === 'admin' ? 'Admin User' : role === 'worker' ? 'Rajesh Kumar' : 'Priya Sharma'),
      });
      return;
    }

    if (!payload) {
      throw new Error('Authentication details are required');
    }

    const isRegisterRequest = Boolean(payload.name || payload.phone_number) && !payload.code;
    const isOtpRequest = Boolean(payload.phone_number && payload.code);

    if (isRegisterRequest) {
      const response = await apiFetch<{ success: boolean; data?: { access_token?: string; refresh_token?: string; user?: { role?: UserRole; email?: string; phone_number?: string; }; }; message?: string }>('/api/auth/register', {
        name: payload.name,
        email: payload.email,
        phone_number: payload.phone_number,
        password: payload.password,
        role,
      });

      const data = response.data ?? {};
      const userName = payload.name || data.user?.email?.split('@')[0] || 'User';
      const accessToken = data.access_token ?? '';
      const refreshToken = data.refresh_token ?? '';

      if (!accessToken || !refreshToken) {
        throw new Error(response.message || 'No tokens returned from register endpoint');
      }

      setAuthenticatedState(data.user?.role ?? role, userName, accessToken, refreshToken);
      return;
    }

    if (isOtpRequest) {
      const response = await apiFetch<{ success: boolean; data?: { access_token?: string; refresh_token?: string; user?: { role?: UserRole; email?: string; phone_number?: string; }; }; message?: string }>('/api/auth/otp/verify', {
        phone_number: payload.phone_number,
        code: payload.code,
        role,
        purpose: 'login',
      });

      const data = response.data ?? {};
      const userName = data.user?.email?.split('@')[0] || 'User';
      const accessToken = data.access_token ?? '';
      const refreshToken = data.refresh_token ?? '';

      if (!accessToken || !refreshToken) {
        throw new Error(response.message || 'No tokens returned from OTP verification endpoint');
      }

      setAuthenticatedState(data.user?.role ?? role, userName, accessToken, refreshToken);
      return;
    }

    const normalizedEmail = payload.email?.trim();
    if (!normalizedEmail || !payload.password) {
      throw new Error('Email and password are required');
    }

    const response = await apiFetch<{ success: boolean; data?: { access_token?: string; refresh_token?: string; user?: { role?: UserRole; email?: string; phone_number?: string; }; }; message?: string }>('/api/auth/login', {
      email: normalizedEmail,
      password: payload.password,
      role,
    });

    const data = response.data ?? {};
    const userName = data.user?.email?.split('@')[0] || 'User';
    const accessToken = data.access_token ?? '';
    const refreshToken = data.refresh_token ?? '';

    if (!accessToken || !refreshToken) {
      throw new Error(response.message || 'No tokens returned from login endpoint');
    }

    setAuthenticatedState(data.user?.role ?? role, userName, accessToken, refreshToken);
  };

  const logout = async () => {
    if (refreshTokenMemory) {
      try {
        await apiFetch('/api/auth/logout', { refresh_token: refreshTokenMemory });
      } catch {
        // Ignore server-side logout errors and clear local auth state anyway.
      }
    }

    accessTokenMemory = null;
    refreshTokenMemory = null;
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
