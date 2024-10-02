import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: 'invitation' | 'message' | 'like';
  content: string;
  from: string;
}

export default function NotificationItem({
  notification,
  onAction,
}: {
  notification: Notification;
  onAction: (id: string, action: 'accept' | 'reject') => void;
}) {
  return (
    <div className="mb-4 border-b pb-4 last:border-b-0">
      <p className="mb-2">
        <strong>{notification.from}</strong> {notification.content}
      </p>
      {notification.type === 'invitation' && (
        <div className="flex space-x-2">
          <Button size="sm" onClick={() => onAction(notification.id, 'accept')}>
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAction(notification.id, 'reject')}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}
