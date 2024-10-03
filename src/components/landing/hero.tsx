import { Button } from '../ui/button';
import { Link } from '@tanstack/react-router';

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Collaborative Coding Made Simple
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Code together in real-time. Debug faster. Ship quicker.
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild>
              <Link to="/signin">Sign in</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
