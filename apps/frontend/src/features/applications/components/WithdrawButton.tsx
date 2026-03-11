import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import {
  withdrawApplicationSchema,
  type WithdrawApplication,
} from '#/features/applications/schemas';
import { UserX } from 'lucide-react';

type WithdrawButtonProps = {
  disabled: boolean;
  isPending: boolean;
  onWithdraw: (data: WithdrawApplication) => void;
};

export function WithdrawButton({
  disabled,
  isPending,
  onWithdraw,
}: WithdrawButtonProps) {
  return (
    <UncontrolledFormDialog
      schema={withdrawApplicationSchema}
      defaultValues={{
        withdrawnReason: '',
        withdrawnAt: new Date().toISOString().split('T')[0],
      }}
      onSubmit={onWithdraw}
      isPending={isPending}
      label="Withdraw"
      saveLabel="Withdraw"
      description="Please provide a reason for withdrawing this application."
      icon={<UserX className="h-4 w-4" />}
      disabled={disabled}
    >
      {form => (
        <>
          <Controller
            name="withdrawnReason"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="withdrawnReason">Reason</FieldLabel>
                <Textarea
                  {...field}
                  id="withdrawnReason"
                  placeholder="Enter withdrawal reason..."
                  rows={4}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="withdrawnAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="withdrawnAt">Date</FieldLabel>
                <Input
                  {...field}
                  id="withdrawnAt"
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
