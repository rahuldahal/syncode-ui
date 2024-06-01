import { useEffect } from 'react';
import useAuthStore from '@/store/auth.store';
import { Navigate } from '@tanstack/react-router';

export default function Editor() {
  const { isAuthenticated, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <h1 className="text-3xl">Hello from the Editor!</h1>;
}
