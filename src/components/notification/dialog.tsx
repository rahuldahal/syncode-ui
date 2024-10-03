import NotificationItem from './item';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'invitation' | 'message' | 'like';
  content: string;
  from: string;
  onAction?: (id: string, action: 'accept' | 'reject') => void;
}

interface NotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onAction: (id: string, action: 'accept' | 'reject') => void;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({
  isOpen,
  onClose,
  notifications,
  onAction,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full pr-4">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No new notifications
            </p>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                onAction={onAction}
              />
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
