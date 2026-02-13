import type { ReactNode } from 'react';
import { Separator } from './ui/separator';

interface SubSectionProps {
  children: ReactNode;
  title: string;
}

export function SubSection({ children, title }: SubSectionProps) {
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <Separator />
        </div>
        {children}
      </div>
    </>
  );
}
