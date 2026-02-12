import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  ApplicationsError,
  ApplicationsSkeleton,
  ApplicationTable,
} from '../components/ApplicationTable';
import { ApplicationSearch } from '../components/ApplicationSearch';

export function ListApplicationPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Applications</h2>
          <p className="text-sm text-muted-foreground">
            Manage rental applications.
          </p>
        </div>
        <Button className="sm:self-start" asChild>
          <Link to="/applications/new">
            <Plus />
            Add Application
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">All applications</CardTitle>
          <ApplicationSearch />
        </CardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={ApplicationsError}
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
