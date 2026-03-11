import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { EditClient } from '#/features/clients/schemas';
import { useEditClient, useClientSuspense } from '../stores/useClients';
import { ClientEditForm } from '../components/ClientEditForm';
import { ClientSkeleton } from '../components/ClientSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';

export function EditClientPage() {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const edit = useEditClient(clientId!);

  const onSubmit: SubmitHandler<EditClient> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Client updated successfully');
      navigate('/clients');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save client'
      );
    }
  };

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
                isPending={edit.isPending}
                onSubmit={onSubmit}
                onCancel={() => navigate('/clients')}
                clientId={clientId!}
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
  isPending: boolean;
  onSubmit: SubmitHandler<EditClient>;
  onCancel: () => void;
};

function InnerClient({
  isPending,
  onSubmit,
  onCancel,
  clientId,
}: InnerClientProps) {
  const { data } = useClientSuspense(clientId);
  return (
    <ClientEditForm
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={onCancel}
      client={data}
    />
  );
}
