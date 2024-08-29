import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';

interface CollaborateProps {
  disabled: boolean;
  form: any;
}

export default function Collaborate({ disabled, form }: CollaborateProps) {
  return (
    <Dialog>
      <DialogTrigger asChild disabled={disabled}>
        <Button>Collaborate</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search user</DialogTitle>
          <DialogDescription>
            Enter the username of the user to invite.
          </DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
}
