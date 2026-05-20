import { API } from '@/constants';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
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
      // Une autre requête est déjà en train de rafraîchir le token, on met celle-ci en pause
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          headers.set('Authorization', `Bearer ${newToken}`);
          return fetch(`${API.BASE_URL}${endpoint}`, {
            ...fetchOptions,
            headers,
          });
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // Demande d'un nouveau JWT (le cookie HttpOnly est envoyé automatiquement)
      const refreshResponse = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.AUTH.REFRESH}`,
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
          credentials: 'include',
        },
      );

      if (!refreshResponse.ok) {
        throw new Error('Refresh token expiré ou invalide');
      }

      const data = await refreshResponse.json();

      // On sauvegarde le nouveau JWT
      localStorage.setItem('token', data.token);

      // On débloque toutes les requêtes qui étaient en attente
      processQueue(null, data.token);

      // On rejoue la requête initiale qui avait échoué avec le nouveau token
      headers.set('Authorization', `Bearer ${data.token}`);
      response = await fetch(`${API.BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
      });
    } catch (error) {
      // Si le refresh échoue (cookie expiré après 30 jours), on vide tout et on déconnecte
      processQueue(error, null);
      localStorage.removeItem('token');
      window.location.href = '/login';
    } finally {
      isRefreshing = false;
    }
  }

  return response;
};
