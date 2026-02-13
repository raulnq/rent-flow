import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

type CompleteButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function CompleteButton({
  onClick,
  disabled = false,
}: CompleteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      title="Complete"
    >
      <CheckCircle className="h-4 w-4" />
    </Button>
  );
}
