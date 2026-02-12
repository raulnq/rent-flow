import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  editApplicationSchema,
  type EditApplication,
  type Application,
} from '#/features/applications/schemas';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export function EditApplicationError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive mb-4">Failed to load application.</p>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}

export function EditApplicationSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Application Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-px w-full" />
            </div>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[70px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          {/* Others Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[60px]" />
              <Skeleton className="h-px w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[110px]" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          {/* Audit Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[50px]" />
              <Skeleton className="h-px w-full" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end gap-2 w-full">
          <Skeleton className="h-10 w-[80px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </CardFooter>
    </Card>
  );
}

type EditApplicationFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditApplication>;
  application: Application;
};

export function EditApplicationForm({
  isPending,
  onSubmit,
  application,
}: EditApplicationFormProps) {
  const navigate = useNavigate();

  const form = useForm<EditApplication>({
    resolver: zodResolver(editApplicationSchema),
    defaultValues: {
      applicationId: application.applicationId,
      notes: application.notes,
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Application Details</CardTitle>
            <Badge>{application.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form
            id="form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Basic Info Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Basic Info
                </h3>
                <Separator />
              </div>
              <Field>
                <FieldLabel>Property</FieldLabel>
                <Input value={application.propertyAddress ?? 'N/A'} disabled />
              </Field>
              <Field>
                <FieldLabel>Lead</FieldLabel>
                <Input value={application.leadName ?? 'N/A'} disabled />
              </Field>
            </div>

            {/* Others Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Others
                </h3>
                <Separator />
              </div>
              <Controller
                name="notes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="notes">Additional Notes</FieldLabel>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      id="notes"
                      aria-invalid={fieldState.invalid}
                      placeholder="Notes (optional)"
                      disabled={isPending}
                      rows={3}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Audit Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Audit</h3>
                <Separator />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Created At</FieldLabel>
                  <Input
                    value={new Date(application.createdAt).toLocaleString()}
                    disabled
                  />
                </Field>
                {application.reviewStartedAt && (
                  <Field>
                    <FieldLabel>Review Started At</FieldLabel>
                    <Input value={application.reviewStartedAt} disabled />
                  </Field>
                )}
              </div>
              {(application.approvedAt || application.contractSignedAt) && (
                <div className="grid grid-cols-2 gap-4">
                  {application.approvedAt && (
                    <Field>
                      <FieldLabel>Approved At</FieldLabel>
                      <Input value={application.approvedAt} disabled />
                    </Field>
                  )}
                  {application.contractSignedAt && (
                    <Field>
                      <FieldLabel>Contract Signed At</FieldLabel>
                      <Input value={application.contractSignedAt} disabled />
                    </Field>
                  )}
                </div>
              )}
              {application.rejectedAt && (
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Rejected At</FieldLabel>
                    <Input value={application.rejectedAt} disabled />
                  </Field>
                  <Field>
                    <FieldLabel>Rejected Reason</FieldLabel>
                    <Textarea
                      value={application.rejectedReason ?? ''}
                      disabled
                      rows={2}
                    />
                  </Field>
                </div>
              )}
              {application.withdrawnAt && (
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Withdrawn At</FieldLabel>
                    <Input value={application.withdrawnAt} disabled />
                  </Field>
                  <Field>
                    <FieldLabel>Withdrawn Reason</FieldLabel>
                    <Textarea
                      value={application.withdrawnReason ?? ''}
                      disabled
                      rows={2}
                    />
                  </Field>
                </div>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/applications')}
          >
            Cancel
          </Button>
          <Button type="submit" form="form" disabled={isPending}>
            Save Notes
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
