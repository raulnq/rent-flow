import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { addClientSchema, type AddClient } from '#/features/clients/schemas';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

type AddClientFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddClient>;
};

export function AddClientForm({ isPending, onSubmit }: AddClientFormProps) {
  const navigate = useNavigate();
  const form = useForm<AddClient>({
    resolver: zodResolver(addClientSchema),
    defaultValues: {
      name: '',
      dni: '',
      phone: '',
      email: null,
      address: null,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Client Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/clients')}
          >
            Cancel
          </Button>
          <Button type="submit" form="form" disabled={isPending}>
            Save Client
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
