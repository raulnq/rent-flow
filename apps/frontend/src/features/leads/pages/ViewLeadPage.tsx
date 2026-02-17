import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useLeadSuspense } from '../stores/useLeads';
import { ViewLeadCard } from '../components/ViewLeadCard';
import { LeadSkeleton } from '../components/LeadSkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';
import { ViewCardHeader } from '@/components/ViewCardHeader';
import { ViewCardFooter } from '@/components/ViewCardFooter';
import { Card } from '@/components/ui/card';

export function ViewLeadPage() {
  const navigate = useNavigate();
  const { leadId } = useParams<{ leadId: string }>();

  return (
    <div className="space-y-4">
      <Card>
        <ViewCardHeader title="View Lead" description="View an existing lead.">
          <Button className="sm:self-start" asChild>
            <Link to={`/leads/${leadId}/edit`}>
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
                  message="Failed to load lead"
                />
              )}
            >
              <Suspense fallback={<LeadSkeleton />}>
                <InnerLead leadId={leadId!} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <ViewCardFooter onCancel={() => navigate('/leads')} />
      </Card>
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
