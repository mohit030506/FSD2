import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAccessToken } from '../services/api';
import { logService } from '../services/logService';

interface User {
  username: string;
  role: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkSession: () => Promise<void>;
  refreshTokensState: (access: string | null, refresh: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(
    localStorage.getItem('refreshToken')
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync Axios memory storage and local state
  const refreshTokensState = (access: string | null, refresh: string | null) => {
    setAccessToken(access);
    setAccessTokenState(access);
    if (refresh) {
      localStorage.setItem('refreshToken', refresh);
      setRefreshTokenState(refresh);
    } else {
      localStorage.removeItem('refreshToken');
      setRefreshTokenState(null);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await api.post('/api/login', { username, password });
      const { user: userData, accessToken: newAccess, refreshToken: newRefresh } = res.data;
      
      setUser(userData);
      refreshTokensState(newAccess, newRefresh);
    } catch (error: any) {
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    refreshTokensState(null, null);
    logService.addLog('system', '🚪 Session Ended', 'User logged out. Credentials cleared.');
  };

  // Perform initial session checking on mount
  const checkSession = async () => {
    const localRefresh = localStorage.getItem('refreshToken');
    if (!localRefresh) {
      setIsLoading(false);
      return;
    }

    try {
      logService.addLog('system', '🔄 Resuming Session', 'Found refresh token. Requesting silent login...');
      const res = await api.post('/api/refresh', { refreshToken: localRefresh });
      const { accessToken: newAccess, refreshToken: newRefresh } = res.data;
      
      // Parse claims from new access token to reconstruct user profile
      const parts = newAccess.split('.');
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      setUser({
        username: payload.username,
        role: payload.role,
        fullName: payload.username === 'admin' ? 'Administrator' : payload.username === 'editor' ? 'Content Editor' : 'Guest Viewer',
      });
      
      refreshTokensState(newAccess, newRefresh);
    } catch (error) {
      logService.addLog('error', '🔄 Re-auth Failed', 'Existing session token is expired or invalid.');
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();

    // Listen to background updates from interceptor
    const handleLogoutEvent = () => {
      setUser(null);
      setAccessTokenState(null);
      setRefreshTokenState(null);
    };

    const handleTokenUpdatedEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { accessToken: access, refreshToken: refresh } = customEvent.detail || {};
      setAccessTokenState(access);
      if (refresh) {
        setRefreshTokenState(refresh);
      }
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    window.addEventListener('auth-token-updated', handleTokenUpdatedEvent);
    
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
      window.removeEventListener('auth-token-updated', handleTokenUpdatedEvent);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        accessToken,
        refreshToken,
        login,
        logout,
        checkSession,
        refreshTokensState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
