import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddClient } from '#/features/clients/schemas';
import { useAddClient } from '../stores/useClients';
import { AddClientForm } from '../components/AddClientForm';
import { ClientHeader } from '../components/ClientHeader';

export function AddClientPage() {
  const navigate = useNavigate();
  const add = useAddClient();

  const onSubmit: SubmitHandler<AddClient> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Client created successfully');
      navigate(`/clients/${result.clientId}/edit`);
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
        title="Add Client"
        description="Create a new client."
      />
      <AddClientForm isPending={add.isPending} onSubmit={onSubmit} />
    </div>
  );
}
