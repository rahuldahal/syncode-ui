import { useState } from 'react';
import NotificationBell from './bell';
import NotificationDialog from './dialog';
import useNotificationStore from '@/store/notification.store';

export default function NotificationSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications } = useNotificationStore();

  return (
    <>
      <NotificationBell
        notificationsCount={notifications.length}
        onClick={() => setIsOpen(true)}
      />
      <NotificationDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
      />
    </>
  );
}
