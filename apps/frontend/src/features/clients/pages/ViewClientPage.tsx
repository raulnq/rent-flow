import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useClientSuspense } from '../stores/useClients';
import {
  ViewClientCard,
  ViewClientSkeleton,
  ViewClientError,
} from '../components/ViewClientCard';
import { ClientHeader } from '../components/ClientHeader';

export function ViewClientPage() {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();

  return (
    <div className="space-y-4">
      <ClientHeader
        onBack={() => navigate('/clients')}
        title="View Client"
        description="View an existing client."
      >
        <Button className="sm:self-start" asChild>
          <Link to={`/clients/${clientId}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </ClientHeader>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ViewClientError}>
            <Suspense fallback={<ViewClientSkeleton />}>
              <InnerClient clientId={clientId!} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type InnerClientProps = {
  clientId: string;
};

function InnerClient({ clientId }: InnerClientProps) {
  const { data } = useClientSuspense(clientId);
  return <ViewClientCard client={data} />;
}
