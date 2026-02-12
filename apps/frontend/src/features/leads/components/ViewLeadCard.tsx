import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
          {/* Birth Date */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-[75px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Occupation */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Nationality */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Notes */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-[50px]" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type ViewLeadCardProps = {
  lead: Lead;
};

export function ViewLeadCard({ lead }: ViewLeadCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Lead Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input value={lead.name} disabled />
          </Field>
          <Field>
            <FieldLabel>DNI</FieldLabel>
            <Input value={lead.dni} disabled />
          </Field>
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input value={lead.phone} disabled />
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input value={lead.email ?? ''} disabled />
          </Field>
          <Field>
            <FieldLabel>Address</FieldLabel>
            <Input value={lead.address ?? ''} disabled />
          </Field>
          <Field>
            <FieldLabel>Birth Date</FieldLabel>
            <Input value={lead.birthDate ?? ''} disabled />
          </Field>
          <Field>
            <FieldLabel>Occupation</FieldLabel>
            <Input value={lead.occupation ?? ''} disabled />
          </Field>
          <Field>
            <FieldLabel>Nationality</FieldLabel>
            <Input value={lead.nationality ?? ''} disabled />
          </Field>
          <Field>
            <FieldLabel>Notes</FieldLabel>
            <Textarea value={lead.notes ?? ''} disabled />
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}
