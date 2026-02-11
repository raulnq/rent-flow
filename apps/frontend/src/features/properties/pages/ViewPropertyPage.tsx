import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { usePropertySuspense } from '../stores/useProperties';
import {
  ViewPropertyCard,
  ViewPropertySkeleton,
  ViewPropertyError,
} from '../components/ViewPropertyCard';
import { PropertyHeader } from '../components/PropertyHeader';

export function ViewPropertyPage() {
  const navigate = useNavigate();
  const { propertyId } = useParams<{ propertyId: string }>();

  return (
    <div className="space-y-4">
      <PropertyHeader
        onBack={() => navigate('/properties')}
        title="View Property"
        description="View an existing property."
      >
        <Button className="sm:self-start" asChild>
          <Link to={`/properties/${propertyId}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </PropertyHeader>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ViewPropertyError}>
            <Suspense fallback={<ViewPropertySkeleton />}>
              <InnerProperty propertyId={propertyId!} />
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
