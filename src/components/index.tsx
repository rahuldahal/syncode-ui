import LandingPage from './landing';
import useAuthStore from '@/store/auth.store';
import { Navigate } from '@tanstack/react-router';

export default function Index() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/editor" />;
  }

  return <LandingPage />;
}
