import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  addApplicationSchema,
  type AddApplication,
} from '#/features/applications/schemas';
import { LeadCombobox } from '../../leads/components/LeadCombobox';
import { PropertyCombobox } from '../../properties/components/PropertyCombobox';
import { FormCard } from '@/components/FormCard';

type AddApplicationFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddApplication>;
  onCancel: () => void;
};

export function AddApplicationForm({
  isPending,
  onSubmit,
  onCancel,
}: AddApplicationFormProps) {
  const form = useForm<AddApplication>({
    resolver: zodResolver(addApplicationSchema),
    defaultValues: {
      leadId: '',
      propertyId: '',
    },
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      saveText="Save Application"
      isPending={isPending}
      title="Add Application"
      description="Create a new application."
    >
      <FieldGroup>
        <Controller
          name="propertyId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="propertyId">Property</FieldLabel>
              <PropertyCombobox
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="leadId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="leadId">Lead</FieldLabel>
              <LeadCombobox
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </FormCard>
  );
}
