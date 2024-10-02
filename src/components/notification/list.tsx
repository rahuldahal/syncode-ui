import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationItem from './item';

interface Notification {
  id: string;
  type: 'invitation' | 'message' | 'like';
  content: string;
  from: string;
}

export default function NotificationList({
  notifications,
  onAction,
}: {
  notifications: Notification[];
  onAction: (id: string, action: 'accept' | 'reject') => void;
}) {
  return (
    <ScrollArea className="h-[300px] w-full pr-4">
      {notifications.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No new notifications
        </p>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onAction={onAction}
          />
        ))
      )}
    </ScrollArea>
  );
}
