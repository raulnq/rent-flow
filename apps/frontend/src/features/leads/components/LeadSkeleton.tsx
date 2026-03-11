import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { FormSkeleton } from '@/components/FormCard';
import { Skeleton } from '@/components/ui/skeleton';

export function LeadSkeleton() {
  return (
    <FormSkeleton>
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>DNI</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Birth Date</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Nationality</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Occupation</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <FieldSeparator />
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Skeleton className="h-16 w-full" />
        </Field>
        <FieldSeparator />
        <Field>
          <FieldLabel>Additional Notes</FieldLabel>
          <Skeleton className="h-16 w-full" />
        </Field>
      </FieldGroup>
    </FormSkeleton>
  );
}
