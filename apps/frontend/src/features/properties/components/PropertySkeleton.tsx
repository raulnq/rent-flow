import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PropertySkeleton() {
  return (
    <CardContent>
      <FieldGroup>
        <Field>
          <FieldLabel>Client (Owner)</FieldLabel>
          <Skeleton className="h-9 w-full" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Property Type</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Skeleton className="h-16 w-full" />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Skeleton className="h-16 w-full" />
        </Field>
        <Field>
          <FieldLabel htmlFor="location-map">Location</FieldLabel>
          <p className="text-sm text-muted-foreground mb-2">
            Use the search control on the map to find an address, or drag the
            marker to set the exact location.
          </p>
          <Skeleton className="h-[400px] w-full rounded-md" />
          <p className="text-sm text-muted-foreground mt-2">
            Coordinates: —, —
          </p>
        </Field>
        <FieldSeparator />
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Total Area</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Built Area</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Floor Number</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Rooms</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Bathrooms</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Parking Spaces</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Year Built</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Has Elevator</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Allow Pets</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Allow Kids</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <FieldSeparator />
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Rental Price</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Maintenance Fee</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Deposit (months)</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
          <Field>
            <FieldLabel>Min Contract (months)</FieldLabel>
            <Skeleton className="h-9 w-full" />
          </Field>
        </div>
        <FieldSeparator />
        <Field>
          <FieldLabel>Additional Notes</FieldLabel>
          <Skeleton className="h-16 w-full" />
        </Field>
      </FieldGroup>
    </CardContent>
  );
}
