import Root from '@/components/root';
import { createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => <Root />,
});
