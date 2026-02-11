import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { addLeadSchema, type AddLead } from '#/features/leads/schemas';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

type AddLeadFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddLead>;
};

export function AddLeadForm({ isPending, onSubmit }: AddLeadFormProps) {
  const navigate = useNavigate();
  const form = useForm<AddLead>({
    resolver: zodResolver(addLeadSchema),
    defaultValues: {
      name: '',
      dni: '',
      phone: '',
      email: null,
      address: null,
      birthDate: null,
      occupation: null,
      notes: null,
      nationality: null,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Lead Details</CardTitle>
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
          <Controller
            name="birthDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="birthDate">Birth Date</FieldLabel>
                <Input
                  {...field}
                  id="birthDate"
                  type="date"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value || null)}
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="occupation"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="occupation">Occupation</FieldLabel>
                <Input
                  {...field}
                  id="occupation"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value || null)}
                  aria-invalid={fieldState.invalid}
                  placeholder="Occupation (optional)"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="nationality"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
                <Input
                  {...field}
                  id="nationality"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value || null)}
                  aria-invalid={fieldState.invalid}
                  placeholder="Nationality (optional)"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="notes">Notes</FieldLabel>
                <Textarea
                  {...field}
                  id="notes"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value || null)}
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
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/leads')}
          >
            Cancel
          </Button>
          <Button type="submit" form="form" disabled={isPending}>
            Save Lead
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
