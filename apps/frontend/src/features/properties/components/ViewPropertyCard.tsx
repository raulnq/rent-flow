import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-6 w-full max-w-md" />
            </div>
          ))}
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Address
            </label>
            <p className="text-lg font-medium">{property.address}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Property Type
            </label>
            <p className="text-lg font-medium">{property.propertyType}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Client (Owner)
            </label>
            <p className="text-lg font-medium">{property.clientName ?? '—'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Rental Price
            </label>
            <p className="text-lg font-medium">
              ${property.rentalPrice.toFixed(2)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Rooms
              </label>
              <p className="text-lg font-medium">{property.rooms}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Bathrooms
              </label>
              <p className="text-lg font-medium">{property.bathrooms}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Parking Spaces
              </label>
              <p className="text-lg font-medium">{property.parkingSpaces}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Total Area
              </label>
              <p className="text-lg font-medium">
                {property.totalArea.toFixed(2)} m²
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Built Area
              </label>
              <p className="text-lg font-medium">
                {property.builtArea.toFixed(2)} m²
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Floor Number
              </label>
              <p className="text-lg font-medium">{property.floorNumber}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Year Built
              </label>
              <p className="text-lg font-medium">{property.yearBuilt}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <p className="text-lg font-medium">{property.status}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Maintenance Fee
              </label>
              <p className="text-lg font-medium">
                ${property.maintenanceFee.toFixed(2)}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Deposit
              </label>
              <p className="text-lg font-medium">
                {property.depositMonths} months
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Minimum Contract
            </label>
            <p className="text-lg font-medium">
              {property.minimumContractMonths} months
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Has Elevator
              </label>
              <p className="text-lg font-medium">
                {property.hasElevator ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Allow Pets
              </label>
              <p className="text-lg font-medium">
                {property.allowPets ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Allow Kids
              </label>
              <p className="text-lg font-medium">
                {property.allowKids ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Description
            </label>
            <p className="text-lg font-medium">{property.description ?? '—'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Notes
            </label>
            <p className="text-lg font-medium">{property.notes ?? '—'}</p>
          </div>
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
      </CardContent>
    </Card>
  );
}
