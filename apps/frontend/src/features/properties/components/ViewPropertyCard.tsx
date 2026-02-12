import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { lazy, Suspense } from 'react';
import type { Property } from '#/features/properties/schemas';

const MapViewer = lazy(() =>
  import('../../../components/MapViewer').then(module => ({
    default: module.MapViewer,
  }))
);

export function ViewPropertyError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive mb-4">Failed to load property.</p>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}

export function ViewPropertySkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-px w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[90px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-[200px] w-full rounded-md" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          {/* Characteristics Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[110px]" />
              <Skeleton className="h-px w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[70px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[75px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
          {/* Rental Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[85px]" />
              <Skeleton className="h-px w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[90px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
          {/* Others Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[60px]" />
              <Skeleton className="h-px w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[110px]" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type ViewPropertyCardProps = {
  property: Property;
};

export function ViewPropertyCard({ property }: ViewPropertyCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                Basic Info
              </h3>
              <Separator />
            </div>
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Location
                </label>
                <Suspense
                  fallback={
                    <Skeleton className="h-[300px] w-full rounded-md border border-border" />
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
              </div>
            )}
          </div>

          {/* Characteristics Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                Characteristics
              </h3>
              <Separator />
            </div>
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
          </div>

          {/* Rental Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                Rental Info
              </h3>
              <Separator />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Rental Price</FieldLabel>
                <Input value={`$${property.rentalPrice.toFixed(2)}`} disabled />
              </Field>
              <Field>
                <FieldLabel>Maintenance Fee</FieldLabel>
                <Input
                  value={`$${property.maintenanceFee.toFixed(2)}`}
                  disabled
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Deposit (months)</FieldLabel>
                <Input value={property.depositMonths.toString()} disabled />
              </Field>
              <Field>
                <FieldLabel>Min Contract (months)</FieldLabel>
                <Input
                  value={property.minimumContractMonths.toString()}
                  disabled
                />
              </Field>
            </div>
          </div>

          {/* Others Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Others</h3>
              <Separator />
            </div>
            <Field>
              <FieldLabel>Additional Notes</FieldLabel>
              <Textarea value={property.notes ?? ''} disabled rows={3} />
            </Field>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
