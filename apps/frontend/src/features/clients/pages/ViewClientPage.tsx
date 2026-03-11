import { useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useClientSuspense } from '../stores/useClients';
import { ViewClientCard } from '../components/ViewClientCard';
import { ClientSkeleton } from '../components/ClientSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ViewClientPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
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
              <InnerClient
                clientId={clientId!}
                onCancel={() => navigate('/clients')}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type InnerClientProps = {
  clientId: string;
  onCancel: () => void;
};

function InnerClient({ clientId, onCancel }: InnerClientProps) {
  const { data } = useClientSuspense(clientId);
  return <ViewClientCard client={data} onCancel={onCancel} />;
}
