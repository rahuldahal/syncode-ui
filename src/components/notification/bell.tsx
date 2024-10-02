import { useState } from 'react';
import { Bell } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NotificationBellProps {
  initialCount?: number;
  //   onBellClick?: () => void;
}

export default function NotificationBell({
  initialCount = 0,
}: NotificationBellProps = {}) {
  const [count, setCount] = useState(initialCount);

  //   const handleClick = () => {
  //     if (onBellClick) {
  //       onBellClick();
  //     }
  //     setCount((currentCount) => ++currentCount);
  //   };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className="relative cursor-pointer"
            aria-label={`Notifications: ${count} unread`}
          >
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {count === 1
              ? '1 unread notification'
              : `${count} unread notifications`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
