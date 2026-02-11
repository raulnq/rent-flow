import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Lead } from '#/features/leads/schemas';

export function ViewLeadError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive mb-4">Failed to load lead.</p>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}

export function ViewLeadSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Lead Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-6 w-full max-w-md" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type ViewLeadCardProps = {
  lead: Lead;
};

export function ViewLeadCard({ lead: leadData }: ViewLeadCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Lead Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-lg font-medium">{leadData.name}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              DNI
            </label>
            <p className="text-lg font-medium">{leadData.dni}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Phone
            </label>
            <p className="text-lg font-medium">{leadData.phone}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="text-lg font-medium">{leadData.email ?? '—'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Address
            </label>
            <p className="text-lg font-medium">{leadData.address ?? '—'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Birth Date
            </label>
            <p className="text-lg font-medium">{leadData.birthDate ?? '—'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Occupation
            </label>
            <p className="text-lg font-medium">{leadData.occupation ?? '—'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Nationality
            </label>
            <p className="text-lg font-medium">{leadData.nationality ?? '—'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Notes
            </label>
            <p className="text-lg font-medium whitespace-pre-wrap">
              {leadData.notes ?? '—'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
