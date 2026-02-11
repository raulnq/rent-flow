import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Property } from '#/features/properties/schemas';

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
              <p className="text-lg font-medium">{property.numberOfRooms}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Bathrooms
              </label>
              <p className="text-lg font-medium">
                {property.numberOfBathrooms}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Garages
              </label>
              <p className="text-lg font-medium">{property.numberOfGarages}</p>
            </div>
          </div>
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
              Description
            </label>
            <p className="text-lg font-medium">{property.description ?? '—'}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Constraints
            </label>
            <p className="text-lg font-medium">{property.constraints ?? '—'}</p>
          </div>
          {(property.latitude !== null || property.longitude !== null) && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Latitude
                </label>
                <p className="text-lg font-medium">
                  {property.latitude ?? '—'}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Longitude
                </label>
                <p className="text-lg font-medium">
                  {property.longitude ?? '—'}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
