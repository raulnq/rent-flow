import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useLeadSuspense } from '../stores/useLeads';
import {
  ViewLeadCard,
  ViewLeadSkeleton,
  ViewLeadError,
} from '../components/ViewLeadCard';
import { LeadHeader } from '../components/LeadHeader';

export function ViewLeadPage() {
  const navigate = useNavigate();
  const { leadId } = useParams<{ leadId: string }>();

  return (
    <div className="space-y-4">
      <LeadHeader
        onBack={() => navigate('/leads')}
        title="View Lead"
        description="View an existing lead."
      >
        <Button className="sm:self-start" asChild>
          <Link to={`/leads/${leadId}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </LeadHeader>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ViewLeadError}>
            <Suspense fallback={<ViewLeadSkeleton />}>
              <InnerLead leadId={leadId!} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type InnerLeadProps = {
  leadId: string;
};

function InnerLead({ leadId }: InnerLeadProps) {
  const { data } = useLeadSuspense(leadId);
  return <ViewLeadCard lead={data} />;
}
