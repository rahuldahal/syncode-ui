import { Button } from '@/components/ui/button';
import useNotificationStore, { Notification } from '@/store/notification.store';

const NotificationItem: React.FC<Notification> = ({
  id,
  type,
  content,
  from,
  onAction,
}) => {
  const { removeNotification } = useNotificationStore();

  function handleClick(id: number, action: 'accept' | 'reject') {
    onAction && onAction(id, action);
    removeNotification(id);
  }

  return (
    <div className="mb-4 border-b pb-4 last:border-b-0">
      <h6 className="capitalize">{type}</h6>
      <p className="mb-2">
        <strong>{from.username}</strong> {content}
      </p>
      {type === 'invitation' && (
        <div className="flex space-x-2">
          <Button size="sm" onClick={() => handleClick(id, 'accept')}>
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleClick(id, 'reject')}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
