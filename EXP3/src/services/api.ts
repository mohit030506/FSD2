import axios from 'axios';
import { mockAdapter } from './mockServer';
import { logService } from './logService';

// In-memory access token storage (Best practice to prevent XSS)
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Create Axios instance with custom in-browser mock adapter
export const api = axios.create({
  adapter: mockAdapter,
});

// Request Interceptor: Attach bearer token globally
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    const tokenDisplay = token ? `Bearer ...${token.slice(-10)}` : 'None';
    
    logService.addLog(
      'interceptor-req',
      '🔵 Interceptor IN (Request)',
      `Checking credentials. Attaching token: ${tokenDisplay} for path: ${config.url}`
    );
    
    if (token) {
      config.headers = config.headers || ({} as any);
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    logService.addLog('error', '❌ Interceptor Request Error', error.message);
    return Promise.reject(error);
  }
);

// Response Interceptor: Manage token expiry (401) and queuing
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason: any) => void;
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

api.interceptors.response.use(
  (response) => {
    logService.addLog(
      'interceptor-res',
      '🟢 Interceptor OUT (Response Success)',
      `API succeeded with status ${response.status} for ${response.config.url}`
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    logService.addLog(
      'interceptor-res',
      '🔴 Interceptor OUT (Response Error)',
      `Caught error ${error.response?.status || 'network'} on request: ${originalRequest.url}`
    );

    // If response is 401 Unauthorized and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If we are already refreshing, queue this request
      if (isRefreshing) {
        logService.addLog(
          'interceptor-res',
          '⏳ Request Queued',
          `Refresh in progress. Queueing request to ${originalRequest.url}`
        );
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      logService.addLog(
        'interceptor-res',
        '🔄 Access Token Expired',
        'Triggering Silent Refresh Token Flow...'
      );

      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        isRefreshing = false;
        logService.addLog(
          'error',
          '🚪 Refresh Cancelled',
          'No refresh token found in localStorage. Forcing logout.'
        );
        window.dispatchEvent(new Event('auth-logout'));
        return Promise.reject(error);
      }

      try {
        // Send refresh token request (use direct axios to avoid triggering request interceptor again)
        const response = await axios.post('/api/refresh', { refreshToken }, { adapter: mockAdapter });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Save tokens
        setAccessToken(newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        window.dispatchEvent(new CustomEvent('auth-token-updated', {
          detail: { accessToken: newAccessToken, refreshToken: newRefreshToken }
        }));

        logService.addLog(
          'interceptor-res',
          '✨ Session Renewed',
          'Refresh success. Retrying originally failed request.'
        );

        // Resume queued requests
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Update original request auth and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError: any) {
        logService.addLog(
          'error',
          '🚫 Session Invalidated',
          'Refresh token is expired/invalid. Logging out.'
        );
        
        processQueue(refreshError, null);
        isRefreshing = false;
        
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        window.dispatchEvent(new Event('auth-logout'));

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
