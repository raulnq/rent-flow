import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { type ReactNode } from 'react';

type LeadHeaderProps = {
  onBack: () => void;
  title: string;
  description: string;
  children?: ReactNode;
};

export function LeadHeader({
  onBack,
  title,
  description,
  children,
}: LeadHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}
