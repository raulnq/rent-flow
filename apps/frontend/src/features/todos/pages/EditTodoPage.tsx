import { useNavigate, useParams } from 'react-router';
import { type SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import { type EditTodo } from '#/features/todos/schemas';
import { useEditTodo, useTodoSuspense } from '../stores/useTodos';
import {
  EditTodoForm,
  EditTodoSkeleton,
  EditTodoError,
} from '../components/EditTodoForm';
import { TodoHeader } from '../components/TodoHeader';

export function EditTodoPage() {
  const navigate = useNavigate();
  const { todoId } = useParams<{ todoId: string }>();
  const edit = useEditTodo(todoId!);
  const onSubmit: SubmitHandler<EditTodo> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Todo updated successfully');
      navigate(`/todos`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save todo'
      );
    }
  };
  return (
    <div className="space-y-4">
      <TodoHeader
        onBack={() => navigate('/todos')}
        title="Edit Todo"
        description="Edit an existing todo item."
      />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={EditTodoError}>
            <Suspense fallback={<EditTodoSkeleton />}>
              <EditTodo
                isPending={edit.isPending}
                onSubmit={onSubmit}
                todoId={todoId!}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type EditTodoProps = {
  todoId: string;
  isPending: boolean;
  onSubmit: SubmitHandler<EditTodo>;
};

export function EditTodo({ isPending, onSubmit, todoId }: EditTodoProps) {
  const { data } = useTodoSuspense(todoId);
  return <EditTodoForm isPending={isPending} onSubmit={onSubmit} todo={data} />;
}
