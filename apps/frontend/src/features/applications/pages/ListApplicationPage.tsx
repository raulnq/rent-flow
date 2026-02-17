import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  ApplicationsSkeleton,
  ApplicationTable,
} from '../components/ApplicationTable';
import { ApplicationSearchBar } from '../components/ApplicationSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';

export function ListApplicationPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Applications"
          description="Search your applications."
          addLink="/applications/new"
          addText="Add Application"
        >
          <ApplicationSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load applications"
                  />
                )}
              >
                <Suspense fallback={<ApplicationsSkeleton />}>
                  <ApplicationTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
