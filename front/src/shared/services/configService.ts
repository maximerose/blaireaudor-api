import { getApiError } from '@/shared/types';
import { API } from '../constants';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', API.GROUPS.JSON_LD);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', API.GROUPS.JSON_LD);
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  let response = await fetch(`${API.BASE_URL}${endpoint}`, fetchOptions);

  if (
    response.status === 401 &&
    endpoint !== API.ENDPOINTS.AUTH.LOGIN &&
    endpoint !== API.ENDPOINTS.AUTH.REFRESH
  ) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        headers.set('Authorization', `Bearer ${newToken}`);
        return fetch(`${API.BASE_URL}${endpoint}`, {
          ...fetchOptions,
          headers,
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.AUTH.REFRESH}`,
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
          credentials: 'include',
        },
      );

      if (!refreshResponse.ok) throw new Error();

      const data = await refreshResponse.json();
      localStorage.setItem('token', data.token);
      processQueue(null, data.token);

      headers.set('Authorization', `Bearer ${data.token}`);
      response = await fetch(`${API.BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
      });
    } catch {
      processQueue(new Error(), null);
      localStorage.removeItem('token');
      window.location.href = '/login';
      return response;
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    const apiError = await getApiError(response);
    throw apiError;
  }

  return response;
};
