import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  PropertiesError,
  PropertiesSkeleton,
  PropertyTable,
} from '../components/PropertyTable';
import { PropertySearchBar } from '../components/PropertySearchBar';
import { ListCardHeader } from '@/components/ListCardHeader';

export function ListPropertyPage() {
  return (
    <div className="space-y-4">
      <Card>
        <ListCardHeader
          title="Properties"
          description="Search your properties."
          addNewLink="/properties/new"
          addNewText="Add Property"
        >
          <PropertySearchBar />
        </ListCardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                FallbackComponent={PropertiesError}
              >
                <Suspense fallback={<PropertiesSkeleton />}>
                  <PropertyTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
