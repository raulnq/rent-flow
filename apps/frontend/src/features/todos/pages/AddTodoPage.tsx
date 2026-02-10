import { useNavigate } from 'react-router';
import { type SubmitHandler } from 'react-hook-form';

import { toast } from 'sonner';
import { type AddTodo } from '#/features/todos/schemas';
import { useAddTodo } from '../stores/useTodos';
import { AddTodoForm } from '../components/AddTodoForm';
import { TodoHeader } from '../components/TodoHeader';

export function AddTodoPage() {
  const navigate = useNavigate();
  const add = useAddTodo();
  const onSubmit: SubmitHandler<AddTodo> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Todo created successfully');
      navigate(`/todos/${result.todoId}/edit`);
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
        title="Add Todo"
        description="Create a new todo item."
      />
      <AddTodoForm isPending={add.isPending} onSubmit={onSubmit} />
    </div>
  );
}
