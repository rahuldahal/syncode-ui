import Nav from '@/components/nav';
import Main from '@/components/main';
import { Toaster } from '@/components/ui/sonner';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
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
  ),
});
