import { useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useLeadSuspense } from '../stores/useLeads';
import { ViewLeadCard } from '../components/ViewLeadCard';
import { LeadSkeleton } from '../components/LeadSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ViewLeadPage() {
  const { leadId } = useParams<{ leadId: string }>();
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
                message="Failed to load lead"
              />
            )}
          >
            <Suspense fallback={<LeadSkeleton />}>
              <InnerLead leadId={leadId!} onCancel={() => navigate('/leads')} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type InnerLeadProps = {
  leadId: string;
  onCancel: () => void;
};

function InnerLead({ leadId, onCancel }: InnerLeadProps) {
  const { data } = useLeadSuspense(leadId);
  return <ViewLeadCard lead={data} onCancel={onCancel} />;
}
