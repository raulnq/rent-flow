import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import {
  signContractApplicationSchema,
  type SignContractApplication,
} from '#/features/applications/schemas';
import { FileText } from 'lucide-react';

type SignContractButtonProps = {
  disabled: boolean;
  isPending: boolean;
  onSignContract: (data: SignContractApplication) => void;
};

export function SignContractButton({
  disabled,
  isPending,
  onSignContract,
}: SignContractButtonProps) {
  return (
    <UncontrolledFormDialog
      schema={signContractApplicationSchema}
      defaultValues={{
        contractSignedAt: new Date().toISOString().split('T')[0],
      }}
      onSubmit={onSignContract}
      isPending={isPending}
      label="Sign Contract"
      saveLabel="Sign Contract"
      description="Please select the date when the contract was signed."
      icon={<FileText className="h-4 w-4" />}
      disabled={disabled}
    >
      {form => (
        <Controller
          name="contractSignedAt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contractSignedAt">Date</FieldLabel>
              <Input
                {...field}
                id="contractSignedAt"
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
