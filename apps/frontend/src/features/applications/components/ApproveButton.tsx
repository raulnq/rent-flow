import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import {
  approveApplicationSchema,
  type ApproveApplication,
} from '#/features/applications/schemas';
import { CheckCircle } from 'lucide-react';

type ApproveButtonProps = {
  disabled: boolean;
  isPending: boolean;
  onApprove: (data: ApproveApplication) => void;
};

export function ApproveButton({
  disabled,
  isPending,
  onApprove,
}: ApproveButtonProps) {
  return (
    <UncontrolledFormDialog
      schema={approveApplicationSchema}
      defaultValues={{
        approvedAt: new Date().toISOString().split('T')[0],
      }}
      onSubmit={onApprove}
      isPending={isPending}
      label="Approve"
      saveLabel="Approve"
      description="Please select the approval date."
      icon={<CheckCircle className="h-4 w-4" />}
      disabled={disabled}
    >
      {form => (
        <Controller
          name="approvedAt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="approvedAt">Date</FieldLabel>
              <Input
                {...field}
                id="approvedAt"
                type="date"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
    </UncontrolledFormDialog>
  );
}
