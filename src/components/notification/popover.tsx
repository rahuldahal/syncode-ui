import NotificationDialog from '.';
import NotificationBell from './bell';
import { Popover, PopoverTrigger } from '../ui/popover';
import { PopoverContent } from '@radix-ui/react-popover';

export default function NotificationPopOver() {
  return (
    <Popover>
      <PopoverTrigger>
        <NotificationBell />
      </PopoverTrigger>
      <PopoverContent>
        <NotificationDialog />
      </PopoverContent>
    </Popover>
  );
}
