import { AvatarFallback } from '@radix-ui/react-avatar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Link } from '@tanstack/react-router';

export default function Nav() {
  return (
    <nav className="container fixed top-0 left-0 z-10 py-4 shadow-sm flex items-center justify-between">
      <Link to="/">Co-Edit</Link>

      <Avatar>
        <AvatarImage src="https://avatars.githubusercontent.com/u/93955718?v=4" />
        <AvatarFallback>RD</AvatarFallback>
      </Avatar>
    </nav>
  );
}
