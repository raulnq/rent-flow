import { Controller } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { ControlledFormDialog } from '@/components/ControlledFormDialog';
import type { CancelVisit } from '#/features/visits/schemas';
import { cancelVisitSchema } from '#/features/visits/schemas';

type CancelDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: (data: CancelVisit) => Promise<void>;
  isPending: boolean;
};

export function CancelDialog({
  isOpen,
  onOpenChange,
  onCancel,
  isPending,
}: CancelDialogProps) {
  return (
    <ControlledFormDialog
      schema={cancelVisitSchema}
      defaultValues={{
        cancellationReason: '',
      }}
      open={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onCancel}
      isPending={isPending}
      label="Cancel Visit"
      saveLabel="Cancel Visit"
      description="Please provide a reason for cancelling this visit."
    >
      {form => (
        <Controller
          name="cancellationReason"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="cancellationReason">Reason</FieldLabel>
              <Textarea
                {...field}
                id="cancellationReason"
                placeholder="Enter cancellation reason..."
                rows={4}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
    </ControlledFormDialog>
  );
}
