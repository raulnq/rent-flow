import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { LeadsError, LeadsSkeleton, LeadTable } from '../components/LeadTable';
import { LeadSearch } from '../components/LeadSearch';

export function ListLeadPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Leads</h2>
          <p className="text-sm text-muted-foreground">Manage your leads.</p>
        </div>
        <Button className="sm:self-start" asChild>
          <Link to="/leads/new">
            <Plus />
            Add Lead
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">All leads</CardTitle>
          <LeadSearch />
        </CardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} FallbackComponent={LeadsError}>
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
