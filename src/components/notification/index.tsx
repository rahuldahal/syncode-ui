import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import NotificationList from './list';

interface Notification {
  id: string;
  type: 'invitation' | 'message' | 'like';
  content: string;
  from: string;
}

export default function NotificationDialog() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'invitation',
      content: 'invited you to join Group A',
      from: 'John Doe',
    },
    {
      id: '2',
      type: 'message',
      content: 'sent you a message',
      from: 'Jane Smith',
    },
    {
      id: '3',
      type: 'invitation',
      content: 'invited you to an event',
      from: 'Mike Johnson',
    },
    {
      id: '4',
      type: 'like',
      content: 'liked your post',
      from: 'Sarah Williams',
    },
    {
      id: '5',
      type: 'invitation',
      content: 'invited you to join Group B',
      from: 'Tom Brown',
    },
  ]);

  const handleAction = (id: string, action: 'accept' | 'reject') => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id),
    );
    console.log(`Notification ${id} ${action}ed`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <NotificationList
          notifications={notifications}
          onAction={handleAction}
        />
      </DialogContent>
    </Dialog>
  );
}
