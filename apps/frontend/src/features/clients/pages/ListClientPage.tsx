import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  ClientsError,
  ClientsSkeleton,
  ClientTable,
} from '../components/ClientTable';
import { ClientSearchBar } from '../components/ClientSearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';

export function ListClientPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Clients"
          description="Search your clients."
          addNewLink="/clients/new"
          addNewText="Add Client"
        >
          <ClientSearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} FallbackComponent={ClientsError}>
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
