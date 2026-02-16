import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FormCardHeader } from '@/components/FormCardHeader';

export function ApplicationSkeleton() {
  return (
    <>
      <FormCardHeader
        title="Edit Application"
        description="Edit rental application details."
      />
      <CardContent>
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
      </CardContent>
    </>
  );
}
