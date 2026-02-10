# Pages Templates

## List Page (`pages/List<Entity>Page.tsx`)

Header row with title + "Add" button, then Card wrapping search + triple-layer table.

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { <Entities>Error, <Entities>Skeleton, <Entity>Table } from '../components/<Entity>Table';
import { <Entity>Search } from '../components/<Entity>Search';

export function List<Entity>Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold"><Entities></h2>
          <p className="text-sm text-muted-foreground">
            Manage your <entities>.
          </p>
        </div>
        <Button className="sm:self-start" asChild>
          <Link to="/<entities>/new">
            <Plus />
            Add <Entity>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">All <entities></CardTitle>
          <<Entity>Search />
        </CardHeader>
        <CardContent>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} FallbackComponent={<Entities>Error}>
                <Suspense fallback={<<Entities>Skeleton />}>
                  <<Entity>Table />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Add Page (`pages/Add<Entity>Page.tsx`)

Uses mutation hook, navigates to edit page on success, shows toast.

```tsx
import { useNavigate } from 'react-router';
import { type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { type Add<Entity> } from '#/features/<entities>/schemas';
import { useAdd<Entity> } from '../stores/use<Entities>';
import { Add<Entity>Form } from '../components/Add<Entity>Form';
import { <Entity>Header } from '../components/<Entity>Header';

export function Add<Entity>Page() {
  const navigate = useNavigate();
  const add = useAdd<Entity>();

  const onSubmit: SubmitHandler<Add<Entity>> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('<Entity> created successfully');
      navigate(`/<entities>/${result.<entityId>}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save <entity>'
      );
    }
  };

  return (
    <div className="space-y-4">
      <<Entity>Header
        onBack={() => navigate('/<entities>')}
        title="Add <Entity>"
        description="Create a new <entity>."
      />
      <Add<Entity>Form isPending={add.isPending} onSubmit={onSubmit} />
    </div>
  );
}
```

## Edit Page (`pages/Edit<Entity>Page.tsx`)

**Inner component pattern**: page handles layout + error boundary, inner component calls suspense hook.

```tsx
import { useNavigate, useParams } from 'react-router';
import { type SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import { type Edit<Entity> } from '#/features/<entities>/schemas';
import { useEdit<Entity>, use<Entity>Suspense } from '../stores/use<Entities>';
import {
  Edit<Entity>Form,
  Edit<Entity>Skeleton,
  Edit<Entity>Error,
} from '../components/Edit<Entity>Form';
import { <Entity>Header } from '../components/<Entity>Header';

export function Edit<Entity>Page() {
  const navigate = useNavigate();
  const { <entityId> } = useParams<{ <entityId>: string }>();
  const edit = useEdit<Entity>(<entityId>!);

  const onSubmit: SubmitHandler<Edit<Entity>> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('<Entity> updated successfully');
      navigate('/<entities>');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save <entity>'
      );
    }
  };

  return (
    <div className="space-y-4">
      <<Entity>Header
        onBack={() => navigate('/<entities>')}
        title="Edit <Entity>"
        description="Edit an existing <entity>."
      />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={Edit<Entity>Error}>
            <Suspense fallback={<Edit<Entity>Skeleton />}>
              <Inner<Entity>
                isPending={edit.isPending}
                onSubmit={onSubmit}
                <entityId>={<entityId>!}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type Inner<Entity>Props = {
  <entityId>: string;
  isPending: boolean;
  onSubmit: SubmitHandler<Edit<Entity>>;
};

function Inner<Entity>({ isPending, onSubmit, <entityId> }: Inner<Entity>Props) {
  const { data } = use<Entity>Suspense(<entityId>);
  return <Edit<Entity>Form isPending={isPending} onSubmit={onSubmit} <entity>={data} />;
}
```

## View Page (`pages/View<Entity>Page.tsx`)

Same inner component pattern. Header includes an Edit action button via `children` slot.

```tsx
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { use<Entity>Suspense } from '../stores/use<Entities>';
import {
  View<Entity>Card,
  View<Entity>Skeleton,
  View<Entity>Error,
} from '../components/View<Entity>Card';
import { <Entity>Header } from '../components/<Entity>Header';

export function View<Entity>Page() {
  const navigate = useNavigate();
  const { <entityId> } = useParams<{ <entityId>: string }>();

  return (
    <div className="space-y-4">
      <<Entity>Header
        onBack={() => navigate('/<entities>')}
        title="View <Entity>"
        description="View an existing <entity>."
      >
        <Button className="sm:self-start" asChild>
          <Link to={`/<entities>/${<entityId>}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </<Entity>Header>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={View<Entity>Error}>
            <Suspense fallback={<View<Entity>Skeleton />}>
              <Inner<Entity> <entityId>={<entityId>!} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type Inner<Entity>Props = {
  <entityId>: string;
};

function Inner<Entity>({ <entityId> }: Inner<Entity>Props) {
  const { data } = use<Entity>Suspense(<entityId>);
  return <View<Entity>Card <entity>={data} />;
}
```
