import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { usePropertySuspense } from '../stores/useProperties';
import { usePropertyImagesSuspense } from '../stores/usePropertyImages';
import { ViewPropertyCard } from '../components/ViewPropertyCard';
import { PropertySkeleton } from '../components/PropertySkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ViewCardHeader } from '@/components/ViewCardHeader';
import { ViewCardFooter } from '@/components/ViewCardFooter';
import { Card } from '@/components/ui/card';
import {
  ImageUploader,
  ImageUploaderSkeleton,
} from '@/components/ImageUploader';

export function ViewPropertyPage() {
  const navigate = useNavigate();
  const { propertyId } = useParams<{ propertyId: string }>();

  return (
    <div className="space-y-4">
      <Card>
        <ViewCardHeader
          title="View Property"
          description="View an existing property."
        >
          <Button className="sm:self-start" asChild>
            <Link to={`/properties/${propertyId}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </ViewCardHeader>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              FallbackComponent={({ resetErrorBoundary }) => (
                <ErrorFallback
                  resetErrorBoundary={resetErrorBoundary}
                  message="Failed to load property"
                />
              )}
            >
              <Suspense fallback={<PropertySkeleton />}>
                <InnerProperty propertyId={propertyId!} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <ViewCardFooter onCancel={() => navigate('/properties')} />
      </Card>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={({ resetErrorBoundary }) => (
              <ErrorFallback
                resetErrorBoundary={resetErrorBoundary}
                message="Failed to load images"
              />
            )}
          >
            <Suspense fallback={<ImageUploaderSkeleton />}>
              <ImagesSection propertyId={propertyId!} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type InnerPropertyProps = {
  propertyId: string;
};

function InnerProperty({ propertyId }: InnerPropertyProps) {
  const { data } = usePropertySuspense(propertyId);
  return <ViewPropertyCard property={data} />;
}

function ImagesSection({ propertyId }: { propertyId: string }) {
  const { data } = usePropertyImagesSuspense(propertyId);
  return (
    <ImageUploader
      images={data.map(item => ({
        id: item.propertyImageId,
        path: item.imagePath,
      }))}
    />
  );
}
