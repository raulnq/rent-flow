import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useTodoSuspense } from '../stores/useTodos';
import {
  ViewTodoCard,
  ViewTodoSkeleton,
  ViewTodoError,
} from '../components/ViewTodoCard';
import { TodoHeader } from '../components/TodoHeader';

export function ViewTodoPage() {
  const navigate = useNavigate();
  const { todoId } = useParams<{ todoId: string }>();

  return (
    <div className="space-y-4">
      <TodoHeader
        onBack={() => navigate('/todos')}
        title="View Todo"
        description="View an existing todo item."
      >
        <div className="flex gap-2">
          <Button className="sm:self-start" asChild>
            <Link to={`/todos/${todoId}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </TodoHeader>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ViewTodoError}>
            <Suspense fallback={<ViewTodoSkeleton />}>
              <ViewTodo todoId={todoId!} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type ViewTodoProps = {
  todoId: string;
};

export function ViewTodo({ todoId }: ViewTodoProps) {
  const { data } = useTodoSuspense(todoId);
  return <ViewTodoCard todo={data} />;
}
