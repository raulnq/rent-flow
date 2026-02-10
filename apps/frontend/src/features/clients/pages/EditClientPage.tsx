import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { EditClient } from '#/features/clients/schemas';
import { useEditClient, useClientSuspense } from '../stores/useClients';
import {
  EditClientForm,
  EditClientSkeleton,
  EditClientError,
} from '../components/EditClientForm';
import { ClientHeader } from '../components/ClientHeader';

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
      <ClientHeader
        onBack={() => navigate('/clients')}
        title="Edit Client"
        description="Edit an existing client."
      />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={EditClientError}>
            <Suspense fallback={<EditClientSkeleton />}>
              <InnerClient
                isPending={edit.isPending}
                onSubmit={onSubmit}
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
};

function InnerClient({ isPending, onSubmit, clientId }: InnerClientProps) {
  const { data } = useClientSuspense(clientId);
  return (
    <EditClientForm isPending={isPending} onSubmit={onSubmit} client={data} />
  );
}
