import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, X } from 'lucide-react';
import { type Todo } from '#/features/todos/schemas';

export function ViewTodoError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive mb-4">Failed to load todo.</p>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}

export function ViewTodoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Todo Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[60px]" />
            <Skeleton className="h-6 w-full max-w-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-6 w-[100px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type ViewTodoCardProps = {
  todo: Todo;
};

export function ViewTodoCard({ todo }: ViewTodoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Todo Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-lg font-medium">{todo.name}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            {todo.completed ? (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                <span className="font-medium">Completed</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <X className="h-5 w-5" />
                <span className="font-medium">Not completed</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
