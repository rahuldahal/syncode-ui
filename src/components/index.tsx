import { Button } from './ui/button';
import useAuthStore from '@/store/auth.store';
import { Link, Navigate } from '@tanstack/react-router';

export default function Index() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/editor" />;
  }

  return (
    <>
      <h1 className="text-4xl font-bold">The UI is under construction.</h1>

      <div className="mt-4 flex gap-2">
        <Button asChild>
          <Link to="/signin">Sign in</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link to="/signup">Sign up</Link>
        </Button>
      </div>
    </>
  );
}
