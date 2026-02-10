import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  ClientsError,
  ClientsSkeleton,
  ClientTable,
} from '../components/ClientTable';
import { ClientSearch } from '../components/ClientSearch';

export function ListClientPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Clients</h2>
          <p className="text-sm text-muted-foreground">Manage your clients.</p>
        </div>
        <Button className="sm:self-start" asChild>
          <Link to="/clients/new">
            <Plus />
            Add Client
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">All clients</CardTitle>
          <ClientSearch />
        </CardHeader>
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
