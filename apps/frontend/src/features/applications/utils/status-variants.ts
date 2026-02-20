import type { BadgeProps } from '@/components/ui/badge';

const STATUS_VARIANTS: Record<string, BadgeProps['variant']> = {
  New: 'default',
  'Under Review': 'secondary',
  Approved: 'default',
  Rejected: 'destructive',
  Withdrawn: 'secondary',
  'Contract Signed': 'default',
};

export function getStatusVariant(status: string): BadgeProps['variant'] {
  return STATUS_VARIANTS[status] || 'secondary';
}
