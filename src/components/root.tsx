import { useEffect } from 'react';
import Nav from '@/components/nav';
import Main from '@/components/main';
import useAuthStore from '@/store/auth.store';
import { Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export default function Root() {
  const { isLoading, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (isLoading) {
    return <h1 className="text-2xl">Loading...</h1>;
  }

  return (
    <>
      <Nav />
      <Main>
        <>
          <Outlet />
          <Toaster />
        </>
      </Main>
      <TanStackRouterDevtools />
    </>
  );
}
