export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const REFRESH_TOKEN_STORAGE_KEY = 'fixflow_refresh_token';

let accessToken: string | null = null;
let refreshToken: string | null = null;

function readStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

function persistRefreshToken(nextRefreshToken: string | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!nextRefreshToken) {
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, nextRefreshToken);
}

export function setAuthTokens(nextAccessToken: string | null, nextRefreshToken: string | null) {
  accessToken = nextAccessToken;
  refreshToken = nextRefreshToken;
  persistRefreshToken(nextRefreshToken);
}

export function clearAuthTokens() {
  accessToken = null;
  refreshToken = null;
  persistRefreshToken(null);
}

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken ?? readStoredRefreshToken();
}

export async function refreshAccessToken(): Promise<boolean> {
  const activeRefreshToken = refreshToken ?? readStoredRefreshToken();
  if (!activeRefreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ refresh_token: activeRefreshToken }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.detail || data?.message || 'Token refresh failed');
    }

    const nextAccessToken = data?.data?.access_token ?? data?.access_token ?? null;
    const nextRefreshToken = data?.data?.refresh_token ?? data?.refresh_token ?? activeRefreshToken;

    if (!nextAccessToken) {
      throw new Error('No access token returned from refresh endpoint');
    }

    accessToken = nextAccessToken;
    refreshToken = nextRefreshToken;
    persistRefreshToken(nextRefreshToken);
    return true;
  } catch {
    clearAuthTokens();
    return false;
  }
}

export async function refreshSessionSilently(): Promise<{ isLoggedIn: boolean; role: string | null; userName: string }> {
  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    return { isLoggedIn: false, role: null, userName: '' };
  }

  try {
   const profile = await apiRequest<{ data?: { role?: string; email?: string }; role?: string; email?: string }>(
      '/api/users/me',
      { method: 'GET', requireAuth: true, skipRefresh: false },
    );

   const payload = 'data' in profile && profile.data ? profile.data : profile;
   const role = payload?.role ?? 'customer';
    const userName = payload?.email ? String(payload.email).split('@')[0] : 'User';

    return { isLoggedIn: true, role, userName };
  } catch {
    clearAuthTokens();
    return { isLoggedIn: false, role: null, userName: '' };
  }
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: Record<string, unknown> | FormData;
    requireAuth?: boolean;
    skipRefresh?: boolean;
  } = {},
): Promise<T> {
  const { method = 'GET', body, requireAuth = true, skipRefresh = false } = options;

  const headers: Record<string, string> = {};
  const isFormData = body instanceof FormData;

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (requireAuth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const requestInit: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (body && method !== 'GET') {
    requestInit.body = isFormData ? body : JSON.stringify(body);
  }

  let response = await fetch(`${API_BASE_URL}${path}`, requestInit);

  if (response.status === 401 && requireAuth && !skipRefresh) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      };
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...requestInit,
        headers: retryHeaders,
      });
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data?.detail ?? data?.message ?? data?.error ?? 'Request failed';
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
  }

  return (data as T) ?? ({} as T);
}
