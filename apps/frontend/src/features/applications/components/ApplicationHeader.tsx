import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { type ReactNode } from 'react';
import { getStatusVariant } from '../utils/status-variants';

type ApplicationHeaderProps = {
  onBack: () => void;
  title: string;
  description: string;
  status?: string;
  children?: ReactNode;
};

export function ApplicationHeader({
  onBack,
  title,
  description,
  status,
  children,
}: ApplicationHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            {status && (
              <Badge variant={getStatusVariant(status)}>{status}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}
