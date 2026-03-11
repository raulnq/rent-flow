import { useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { usePropertySuspense } from '../stores/useProperties';
import { usePropertyImagesSuspense } from '../stores/usePropertyImages';
import { ViewPropertyCard } from '../components/ViewPropertyCard';
import { PropertySkeleton } from '../components/PropertySkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';
import {
  ImageUploader,
  ImageUploaderSkeleton,
} from '@/components/ImageUploader';

export function ViewPropertyPage() {
  const navigate = useNavigate();
  const { propertyId } = useParams<{ propertyId: string }>();

  return (
    <div className="space-y-4">
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
              <InnerProperty
                propertyId={propertyId!}
                onCancel={() => navigate('/properties')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
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
  onCancel: () => void;
};

function InnerProperty({ propertyId, onCancel }: InnerPropertyProps) {
  const { data } = usePropertySuspense(propertyId);
  return <ViewPropertyCard property={data} onCancel={onCancel} />;
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
