import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ClientsSkeleton, ClientTable } from '../components/ClientTable';
import { ClientSearchBar } from '../components/ClientSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';
import { ErrorFallback } from '@/components/ErrorFallback';
import { AddButton } from '@/components/AddButton';

export function ListClientPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Clients"
          description="Manage your clients."
          renderAction={<AddButton link="/clients/new" text="Add Client" />}
        >
          <ClientSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={({ resetErrorBoundary }) => (
                  <ErrorFallback
                    resetErrorBoundary={resetErrorBoundary}
                    message="Failed to load clients"
                  />
                )}
              >
                <Suspense fallback={<ClientsSkeleton />}>
                  <ClientTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
