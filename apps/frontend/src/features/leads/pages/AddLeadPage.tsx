import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddLead } from '#/features/leads/schemas';
import { useAddLead } from '../stores/useLeads';
import { LeadAddForm } from '../components/LeadAddForm';

export function AddLeadPage() {
  const navigate = useNavigate();
  const add = useAddLead();

  const onSubmit: SubmitHandler<AddLead> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Lead created successfully');
      navigate(`/leads/${result.leadId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save lead'
      );
    }
  };

  return (
    <div className="space-y-4">
      <LeadAddForm
        isPending={add.isPending}
        onSubmit={onSubmit}
        onCancel={() => navigate('/leads')}
      />
    </div>
  );
}
