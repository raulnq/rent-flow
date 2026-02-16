import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function ApplicationError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <p className="text-destructive mb-4">Failed to load application.</p>
          <Button onClick={resetErrorBoundary} variant="outline">
            Try again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
