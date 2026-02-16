import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { lazy, Suspense } from 'react';
import type { Property } from '#/features/properties/schemas';
import { ViewCardContent } from '@/components/ViewCardContent';

const MapViewer = lazy(() =>
  import('../../../components/MapViewer').then(module => ({
    default: module.MapViewer,
  }))
);

type ViewPropertyCardProps = {
  property: Property;
};

export function ViewPropertyCard({ property }: ViewPropertyCardProps) {
  return (
    <ViewCardContent>
      <FieldGroup>
        <Field>
          <FieldLabel>Client (Owner)</FieldLabel>
          <Input value={property.clientName ?? ''} disabled />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Property Type</FieldLabel>
            <Input value={property.propertyType} disabled />
          </Field>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Input value={property.status} disabled />
          </Field>
        </div>
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Textarea value={property.address} disabled rows={2} />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea value={property.description ?? ''} disabled rows={3} />
        </Field>
        {property.latitude !== null && property.longitude !== null && (
          <Field>
            <FieldLabel htmlFor="location-map">Location</FieldLabel>
            <p className="text-sm text-muted-foreground mb-2">
              Use the search control on the map to find an address, or drag the
              marker to set the exact location.
            </p>
            <Suspense
              fallback={
                <Skeleton className="h-[400px] w-full rounded-md border border-border" />
              }
            >
              <MapViewer
                latitude={property.latitude}
                longitude={property.longitude}
              />
            </Suspense>
            <p className="text-sm text-muted-foreground">
              Coordinates: {property.latitude.toFixed(6)},{' '}
              {property.longitude.toFixed(6)}
            </p>
          </Field>
        )}
        <FieldSeparator />
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Total Area</FieldLabel>
            <Input value={`${property.totalArea.toFixed(2)} m²`} disabled />
          </Field>
          <Field>
            <FieldLabel>Built Area</FieldLabel>
            <Input value={`${property.builtArea.toFixed(2)} m²`} disabled />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Floor Number</FieldLabel>
            <Input value={property.floorNumber.toString()} disabled />
          </Field>
          <Field>
            <FieldLabel>Rooms</FieldLabel>
            <Input value={property.rooms.toString()} disabled />
          </Field>
          <Field>
            <FieldLabel>Bathrooms</FieldLabel>
            <Input value={property.bathrooms.toString()} disabled />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Parking Spaces</FieldLabel>
            <Input value={property.parkingSpaces.toString()} disabled />
          </Field>
          <Field>
            <FieldLabel>Year Built</FieldLabel>
            <Input value={property.yearBuilt.toString()} disabled />
          </Field>
          <Field>
            <FieldLabel>Has Elevator</FieldLabel>
            <Input value={property.hasElevator ? 'Yes' : 'No'} disabled />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Allow Pets</FieldLabel>
            <Input value={property.allowPets ? 'Yes' : 'No'} disabled />
          </Field>
          <Field>
            <FieldLabel>Allow Kids</FieldLabel>
            <Input value={property.allowKids ? 'Yes' : 'No'} disabled />
          </Field>
        </div>
        <FieldSeparator />
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Rental Price</FieldLabel>
            <Input value={`$${property.rentalPrice.toFixed(2)}`} disabled />
          </Field>
          <Field>
            <FieldLabel>Maintenance Fee</FieldLabel>
            <Input value={`$${property.maintenanceFee.toFixed(2)}`} disabled />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Deposit (months)</FieldLabel>
            <Input value={property.depositMonths.toString()} disabled />
          </Field>
          <Field>
            <FieldLabel>Min Contract (months)</FieldLabel>
            <Input value={property.minimumContractMonths.toString()} disabled />
          </Field>
        </div>
        <FieldSeparator />
        <Field>
          <FieldLabel>Additional Notes</FieldLabel>
          <Textarea value={property.notes ?? ''} disabled rows={3} />
        </Field>
      </FieldGroup>
    </ViewCardContent>
  );
}
