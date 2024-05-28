import Nav from '@/components/nav';
import Main from '@/components/main';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <>
      <Nav />
      <Main>
        <Outlet />
      </Main>
      <TanStackRouterDevtools />
    </>
  ),
});
