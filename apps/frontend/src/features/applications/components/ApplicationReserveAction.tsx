import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import {
  reserveApplicationSchema,
  type ReserveApplication,
} from '#/features/applications/schemas';
import { Calendar } from 'lucide-react';

type ApplicationReserveActionProps = {
  disabled: boolean;
  isPending: boolean;
  onReserve: (data: ReserveApplication) => void;
};

export function ApplicationReserveAction({
  disabled,
  isPending,
  onReserve,
}: ApplicationReserveActionProps) {
  return (
    <UncontrolledFormDialog
      schema={reserveApplicationSchema}
      defaultValues={{
        reservedAt: new Date().toISOString().split('T')[0],
        reservedAmount: 0,
      }}
      onSubmit={onReserve}
      isPending={isPending}
      label="Reserve"
      saveLabel="Reserve"
      description="Please enter the reservation date and amount."
      icon={<Calendar className="h-4 w-4" />}
      disabled={disabled}
    >
      {form => (
        <>
          <Controller
            name="reservedAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reservedAt">Date</FieldLabel>
                <Input
                  {...field}
                  id="reservedAt"
                  type="date"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="reservedAmount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reservedAmount">Amount</FieldLabel>
                <Input
                  {...field}
                  id="reservedAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  aria-invalid={fieldState.invalid}
                  onChange={e => field.onChange(parseFloat(e.target.value))}
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
