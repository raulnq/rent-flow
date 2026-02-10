import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { TodosError, TodosSkeleton, TodoTable } from '../components/TodoTable';
import { TodoSearch } from '../components/TodoSearch';

export function ListTodoPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Todos</h2>
          <p className="text-sm text-muted-foreground">
            Things you need to do.
          </p>
        </div>
        <Button className="sm:self-start" asChild>
          <Link to="/todos/new">
            <Plus />
            Add Todo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">All todos</CardTitle>
          <TodoSearch />
        </CardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} FallbackComponent={TodosError}>
                <Suspense fallback={<TodosSkeleton />}>
                  <TodoTable />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
