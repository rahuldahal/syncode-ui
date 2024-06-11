import { Button } from './ui/button';
import useAuthStore from '@/store/auth.store';
import useFileStore from '@/store/file.store';
import { useNavigate } from '@tanstack/react-router';

export default function Logout() {
  const navigate = useNavigate();
  const { clearAccessToken } = useAuthStore();
  const { clearFiles } = useFileStore();

  const handleLogout = () => {
    clearAccessToken();
    clearFiles();
    navigate({ to: '/signin' });
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      Logout
    </Button>
  );
}
