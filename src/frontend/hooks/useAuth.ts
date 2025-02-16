import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthService } from '@/backend/services/auth.service';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
}

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      const { token, user } = response;
      localStorage.setItem('token', token);
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });
      return true;
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
    router.push('/login');
  }, [router]);

  const verifySession = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const user = await AuthService.verifyToken(token);
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });
    } catch (error) {
      localStorage.removeItem('token');
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  return {
    ...authState,
    login,
    logout,
    verifySession,
  };
};