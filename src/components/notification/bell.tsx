import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NotificationBellProps {
  notificationsCount: number;
  onClick: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notificationsCount,
  onClick,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={onClick}
            aria-label={`Notifications: ${notificationsCount} unread`}
          >
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                {notificationsCount > 99 ? '99+' : notificationsCount}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {notificationsCount === 1
              ? '1 unread notification'
              : `${notificationsCount} unread notifications`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotificationBell;
