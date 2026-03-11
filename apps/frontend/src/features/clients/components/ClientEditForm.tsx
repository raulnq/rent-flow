import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  editClientSchema,
  type EditClient,
  type Client,
} from '#/features/clients/schemas';
import { FormCard } from '@/components/FormCard';

type ClientEditFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditClient>;
  onCancel: () => void;
  client: Client;
};

export function ClientEditForm({
  isPending,
  onSubmit,
  onCancel,
  client,
}: ClientEditFormProps) {
  const form = useForm<EditClient>({
    resolver: zodResolver(editClientSchema),
    defaultValues: client,
  });

  return (
    <FormCard
      onSubmit={form.handleSubmit(onSubmit)}
      onCancel={onCancel}
      saveText="Save Client"
      isPending={isPending}
      title="Edit Client"
      description="Edit an existing client."
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Full name"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="dni"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="dni">DNI</FieldLabel>
              <Input
                {...field}
                id="dni"
                aria-invalid={fieldState.invalid}
                placeholder="DNI"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input
                {...field}
                id="phone"
                aria-invalid={fieldState.invalid}
                placeholder="Phone number"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || null)}
                aria-invalid={fieldState.invalid}
                placeholder="Email (optional)"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Textarea
                {...field}
                id="address"
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || null)}
                aria-invalid={fieldState.invalid}
                placeholder="Address (optional)"
                disabled={isPending}
                rows={3}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </FormCard>
  );
}
