import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { EditLead } from '#/features/leads/schemas';
import { useEditLead, useLeadSuspense } from '../stores/useLeads';
import { EditLeadForm } from '../components/EditLeadForm';
import { LeadSkeleton } from '../components/LeadSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';

export function EditLeadPage() {
  const navigate = useNavigate();
  const { leadId } = useParams<{ leadId: string }>();
  const edit = useEditLead(leadId!);

  const onSubmit: SubmitHandler<EditLead> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Lead updated successfully');
      navigate('/leads');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save lead'
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
                message="Failed to load lead"
              />
            )}
          >
            <Suspense fallback={<LeadSkeleton />}>
              <InnerLead
                isPending={edit.isPending}
                onSubmit={onSubmit}
                onCancel={() => navigate('/leads')}
                leadId={leadId!}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type InnerLeadProps = {
  leadId: string;
  isPending: boolean;
  onSubmit: SubmitHandler<EditLead>;
  onCancel: () => void;
};

function InnerLead({ isPending, onSubmit, onCancel, leadId }: InnerLeadProps) {
  const { data } = useLeadSuspense(leadId);
  return (
    <EditLeadForm
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={onCancel}
      lead={data}
    />
  );
}
