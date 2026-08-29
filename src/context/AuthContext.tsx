import { createContext, useContext, useState, type ReactNode } from 'react';
import { apiRequest, clearAuthTokens, getRefreshToken, setAuthTokens } from '@/services/api';

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
  login: (role: UserRole, payload?: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    role: null,
    userName: '',
  });

  const setAuthenticatedState = (role: UserRole, userName: string, accessToken: string, refreshToken: string) => {
    setAuthTokens(accessToken, refreshToken);
    setAuth({
      isLoggedIn: true,
      role,
      userName,
    });
  };

  const login = async (role: UserRole, payload?: LoginPayload) => {
    if (!payload) {
      throw new Error('Authentication details are required');
    }

    type AuthApiResponse = {
      success: boolean;
      message?: string;
      data?: {
        access_token?: string;
        refresh_token?: string;
        user?: { role?: UserRole; email?: string; phone_number?: string };
      };
    };

    const isRegisterRequest = Boolean(payload.name || payload.phone_number) && !payload.code;
    const isOtpRequest = Boolean(payload.phone_number && payload.code);

    if (isRegisterRequest) {
      const response = await apiRequest<AuthApiResponse>('/api/auth/register', {
        method: 'POST',
        body: {
          name: payload.name,
          email: payload.email,
          phone_number: payload.phone_number,
          password: payload.password,
          role,
        },
      });

      const data = response.data ?? {};
      const accessToken = data.access_token ?? '';
      const refreshToken = data.refresh_token ?? '';
      const userName = payload.name || data.user?.email?.split('@')[0] || 'User';

      if (!accessToken || !refreshToken) {
        throw new Error(response.message || 'No tokens returned from register endpoint');
      }

      setAuthenticatedState(data.user?.role ?? role, userName, accessToken, refreshToken);
      return;
    }

    if (isOtpRequest) {
      const response = await apiRequest<AuthApiResponse>('/api/auth/otp/verify', {
        method: 'POST',
        body: {
          phone_number: payload.phone_number,
          code: payload.code,
          role,
          purpose: 'login',
        },
      });

      const data = response.data ?? {};
      const accessToken = data.access_token ?? '';
      const refreshToken = data.refresh_token ?? '';
      const userName = data.user?.email?.split('@')[0] || 'User';

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

    const response = await apiRequest<AuthApiResponse>('/api/auth/login', {
      method: 'POST',
      body: {
        email: normalizedEmail,
        password: payload.password,
        role,
      },
    });

    const data = response.data ?? {};
    const accessToken = data.access_token ?? '';
    const refreshToken = data.refresh_token ?? '';
    const userName = data.user?.email?.split('@')[0] || 'User';

    if (!accessToken || !refreshToken) {
      throw new Error(response.message || 'No tokens returned from login endpoint');
    }

    setAuthenticatedState(data.user?.role ?? role, userName, accessToken, refreshToken);
  };

  const logout = async () => {
    const currentRefreshToken = getRefreshToken();
    if (currentRefreshToken) {
      try {
        await apiRequest('/api/auth/logout', {
          method: 'POST',
          body: { refresh_token: currentRefreshToken },
        });
      } catch {
        // Ignore server-side logout errors and clear local auth state anyway.
      }
    }

    clearAuthTokens();
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
