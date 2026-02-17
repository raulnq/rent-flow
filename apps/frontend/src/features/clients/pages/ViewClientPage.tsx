import { Link, useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useClientSuspense } from '../stores/useClients';
import { ViewClientCard } from '../components/ViewClientCard';
import { Card } from '@/components/ui/card';
import { ViewCardHeader } from '@/components/ViewCardHeader';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { ClientSkeleton } from '../components/ClientSkeleton';
import { ViewCardFooter } from '@/components/ViewCardFooter';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ViewClientPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <Card>
        <ViewCardHeader
          title="View Client"
          description="View an existing client."
        >
          <Button className="sm:self-start" asChild>
            <Link to={`/clients/${clientId!}/edit`}>
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
                  message="Failed to load client"
                />
              )}
            >
              <Suspense fallback={<ClientSkeleton />}>
                <InnerClient clientId={clientId!} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <ViewCardFooter onCancel={() => navigate('/clients')} />
      </Card>
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
