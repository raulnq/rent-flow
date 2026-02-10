import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  editClientSchema,
  type EditClient,
  type Client,
} from '#/features/clients/schemas';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function EditClientError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive mb-4">Failed to load client.</p>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}

export function EditClientSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Client Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end gap-2 w-full">
          <Skeleton className="h-10 w-[80px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </CardFooter>
    </Card>
  );
}

type EditClientFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditClient>;
  client: Client;
};

export function EditClientForm({
  isPending,
  onSubmit,
  client: clientData,
}: EditClientFormProps) {
  const navigate = useNavigate();

  const form = useForm<EditClient>({
    resolver: zodResolver(editClientSchema),
    defaultValues: clientData,
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
