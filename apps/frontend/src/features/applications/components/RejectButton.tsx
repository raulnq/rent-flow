import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import {
  rejectApplicationSchema,
  type RejectApplication,
} from '#/features/applications/schemas';
import { XCircle } from 'lucide-react';

type RejectButtonProps = {
  disabled: boolean;
  isPending: boolean;
  onReject: (data: RejectApplication) => void;
};

export function RejectButton({
  disabled,
  isPending,
  onReject,
}: RejectButtonProps) {
  return (
    <UncontrolledFormDialog
      schema={rejectApplicationSchema}
      defaultValues={{
        rejectedReason: '',
        rejectedAt: new Date().toISOString().split('T')[0],
      }}
      onSubmit={onReject}
      isPending={isPending}
      label="Reject"
      saveLabel="Reject"
      description="Please provide a reason for rejecting this application."
      icon={<XCircle className="h-4 w-4" />}
      disabled={disabled}
    >
      {form => (
        <>
          <Controller
            name="rejectedReason"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="rejectedReason">Reason</FieldLabel>
                <Textarea
                  {...field}
                  id="rejectedReason"
                  placeholder="Enter rejection reason..."
                  rows={4}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="rejectedAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="rejectedAt">Date</FieldLabel>
                <Input
                  {...field}
                  id="rejectedAt"
                  type="date"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </>
      )}
    </UncontrolledFormDialog>
  );
}
