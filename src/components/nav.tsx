import Logout from './logout';
import { Code } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import useAuthStore from '@/store/auth.store';
import NotificationSystem from './notification';
import { Avatar, AvatarImage } from './ui/avatar';

export default function Nav() {
  const { isAuthenticated, userInfo } = useAuthStore();
  const avatarSrc = userInfo?.picture || undefined;

  return (
    <nav className="container fixed top-0 left-0 z-10 py-4 shadow-sm flex items-center justify-between">
      <Link className="flex items-center justify-center" href="#">
        <Code className="h-6 w-6" />
        <span className="ml-2 text-2xl font-bold">Syncode</span>
      </Link>

      {isAuthenticated && (
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src={avatarSrc} />
          </Avatar>
          <NotificationSystem />
          <Logout />
        </div>
      )}
    </nav>
  );
}
