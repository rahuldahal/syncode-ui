import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';

export default function Index() {
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
