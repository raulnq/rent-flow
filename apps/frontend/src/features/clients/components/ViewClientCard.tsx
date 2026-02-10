import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Client } from '#/features/clients/schemas';

export function ViewClientError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive mb-4">Failed to load client.</p>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}

export function ViewClientSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Client Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
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

type ViewClientCardProps = {
  client: Client;
};

export function ViewClientCard({ client: clientData }: ViewClientCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Client Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-lg font-medium">{clientData.name}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              DNI
            </label>
            <p className="text-lg font-medium">{clientData.dni}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Phone
            </label>
            <p className="text-lg font-medium">{clientData.phone}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="text-lg font-medium">{clientData.email ?? '—'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Address
            </label>
            <p className="text-lg font-medium">{clientData.address ?? '—'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
