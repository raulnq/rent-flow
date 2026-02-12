import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
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
          {/* Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-[50px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* DNI */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-[35px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Phone */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-[50px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Email */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-[45px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Address */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-[60px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type ViewClientCardProps = {
  client: Client;
};

export function ViewClientCard({ client }: ViewClientCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Client Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input value={client.name} disabled />
          </Field>
          <Field>
            <FieldLabel>DNI</FieldLabel>
            <Input value={client.dni} disabled />
          </Field>
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input value={client.phone} disabled />
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input value={client.email ?? ''} disabled />
          </Field>
          <Field>
            <FieldLabel>Address</FieldLabel>
            <Input value={client.address ?? ''} disabled />
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}
