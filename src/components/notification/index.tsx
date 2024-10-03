'use client';

import { useState } from 'react';
import NotificationBell from './bell';
import NotificationDialog from './dialog';

interface Notification {
  id: string;
  type: 'invitation' | 'message' | 'like';
  content: string;
  from: string;
  onAction?: (id: string, action: 'accept' | 'reject') => void;
}

export default function NotificationSystem() {
  const [isOpen, setIsOpen] = useState(false);
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
    // Here you would typically send the action to your backend
    console.log(`Notification ${id} ${action}ed`);
  };

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
        onAction={handleAction}
      />
    </>
  );
}
