import Logout from './logout';
import { Link } from '@tanstack/react-router';
import useAuthStore from '@/store/auth.store';
import NotificationSystem from './notification';
import { Avatar, AvatarImage } from './ui/avatar';

export default function Nav() {
  const { isAuthenticated, userInfo } = useAuthStore();
  const avatarSrc = userInfo?.picture || undefined;

  return (
    <nav className="container fixed top-0 left-0 z-10 py-4 shadow-sm flex items-center justify-between">
      <Link to="/">Co-Edit</Link>

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
