import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: 'invitation' | 'message' | 'like';
  content: string;
  from: string;
  onAction: (id: string, action: 'accept' | 'reject') => void;
}

const NotificationItem: React.FC<Notification> = ({
  id,
  type,
  content,
  from,
  onAction,
}) => {
  return (
    <div className="mb-4 border-b pb-4 last:border-b-0">
      <p className="mb-2">
        <strong>{from}</strong> {content}
      </p>
      {type === 'invitation' && (
        <div className="flex space-x-2">
          <Button size="sm" onClick={() => onAction(id, 'accept')}>
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAction(id, 'reject')}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
