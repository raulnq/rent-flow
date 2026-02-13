import { Button } from '@/components/ui/button';
import { UserX } from 'lucide-react';

type NoAttendButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function NoAttendButton({
  onClick,
  disabled = false,
}: NoAttendButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      title="Did Not Attend"
    >
      <UserX className="h-4 w-4" />
    </Button>
  );
}
