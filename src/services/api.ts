const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setAuthTokens(nextAccessToken: string | null, nextRefreshToken: string | null) {
  accessToken = nextAccessToken;
  refreshToken = nextRefreshToken;
}

export function clearAuthTokens() {
  accessToken = null;
  refreshToken = null;
}

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken;
}

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.detail || data?.message || 'Token refresh failed');
    }

    const nextAccessToken = data?.data?.access_token ?? data?.access_token ?? null;
    const nextRefreshToken = data?.data?.refresh_token ?? data?.refresh_token ?? refreshToken;

    if (!nextAccessToken) {
      throw new Error('No access token returned from refresh endpoint');
    }

    accessToken = nextAccessToken;
    refreshToken = nextRefreshToken;
    return true;
  } catch {
    clearAuthTokens();
    return false;
  }
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: Record<string, unknown>;
    requireAuth?: boolean;
    skipRefresh?: boolean;
  } = {},
): Promise<T> {
  const { method = 'GET', body, requireAuth = true, skipRefresh = false } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requireAuth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const requestInit: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (body && method !== 'GET') {
    requestInit.body = JSON.stringify(body);
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
