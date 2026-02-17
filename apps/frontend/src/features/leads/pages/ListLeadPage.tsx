import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { LeadsSkeleton, LeadTable } from '../components/LeadTable';
import { LeadSearchBar } from '../components/LeadSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ListLeadPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Leads"
          description="Search your leads."
          addLink="/leads/new"
          addText="Add Lead"
        >
          <LeadSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load leads"
                  />
                )}
              >
                <Suspense fallback={<LeadsSkeleton />}>
                  <LeadTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
