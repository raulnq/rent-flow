import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { FormSkeleton } from '@/components/FormCard';
import { Skeleton } from '@/components/ui/skeleton';

export function ApplicationSkeleton() {
  return (
    <FormSkeleton>
      <FieldGroup>
        <Field>
          <FieldLabel>Property</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <Field>
          <FieldLabel>Lead</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <FieldSeparator />
        <Field>
          <FieldLabel>Additional Notes</FieldLabel>
          <Skeleton className="h-16 w-full" />
        </Field>
        <FieldSeparator />
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Review Started At</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
      </FieldGroup>
    </FormSkeleton>
  );
}
