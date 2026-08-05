import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  withCredentials: true,
});

export function setAuthHeader(token: string | null): void {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const SKIP_REFRESH_PATHS = ['/user/login', '/user/register', '/user/refresh'];

let refreshPromise: Promise<string> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ code?: string }>) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const isExpired = error.response?.data?.code === 'TOKEN_EXPIRED';
    const isSkippedPath = SKIP_REFRESH_PATHS.some((path) => originalRequest?.url?.includes(path));

    if (!isExpired || !originalRequest || originalRequest._retry || isSkippedPath) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
          refreshPromise = null;
        });
      }
      const token = await refreshPromise;
      originalRequest.headers.set('Authorization', `Bearer ${token}`);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      await handleRefreshFailure();
      return Promise.reject(refreshError);
    }
  },
);

async function performRefresh(): Promise<string> {
  const { data } = await axiosInstance.post<{ accessToken: string }>('/user/refresh');
  setAuthHeader(data.accessToken);
  const { store } = await import('../redux/store');
  const { setAccessToken } = await import('../redux/auth/authSlice');
  store.dispatch(setAccessToken(data.accessToken));
  return data.accessToken;
}

async function handleRefreshFailure(): Promise<void> {
  setAuthHeader(null);
  const { store } = await import('../redux/store');
  const { logoutUser } = await import('../redux/auth/authSlice');
  store.dispatch(logoutUser());
}
