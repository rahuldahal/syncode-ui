import Signin from '@/components/signin';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/signin')({
  component: () => <Signin />,
});
