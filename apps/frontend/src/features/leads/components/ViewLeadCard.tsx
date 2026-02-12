import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
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
          {/* Personal Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-px w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
          {/* Contact Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[90px]" />
              <Skeleton className="h-px w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          {/* Notes Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[50px]" />
              <Skeleton className="h-px w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-20 w-full" />
            </div>
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
          {/* Personal Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                Personal Info
              </h3>
              <Separator />
            </div>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input value={lead.name} disabled />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>DNI</FieldLabel>
                <Input value={lead.dni} disabled />
              </Field>
              <Field>
                <FieldLabel>Birth Date</FieldLabel>
                <Input value={lead.birthDate ?? ''} disabled />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Nationality</FieldLabel>
                <Input value={lead.nationality ?? ''} disabled />
              </Field>
              <Field>
                <FieldLabel>Occupation</FieldLabel>
                <Input value={lead.occupation ?? ''} disabled />
              </Field>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                Contact Info
              </h3>
              <Separator />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input value={lead.email ?? ''} disabled />
              </Field>
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input value={lead.phone} disabled />
              </Field>
            </div>
            <Field>
              <FieldLabel>Address</FieldLabel>
              <Textarea value={lead.address ?? ''} disabled rows={3} />
            </Field>
          </div>

          {/* Others Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Others</h3>
              <Separator />
            </div>
            <Field>
              <FieldLabel>Additional Notes</FieldLabel>
              <Textarea value={lead.notes ?? ''} disabled rows={3} />
            </Field>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
