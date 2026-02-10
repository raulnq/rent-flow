# Components Templates

## Header (`components/<Entity>Header.tsx`)

Reusable header with back button, title, description, and optional `children` slot for action buttons.

```tsx
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { type ReactNode } from 'react';

type <Entity>HeaderProps = {
  onBack: () => void;
  title: string;
  description: string;
  children?: ReactNode;
};

export function <Entity>Header({
  onBack,
  title,
  description,
  children,
}: <Entity>HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}
```

## Search (`components/<Entity>Search.tsx`)

Ref-based input (NOT controlled state), updates URL search params. Resets page to 1 on search/clear.

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRef } from 'react';
import { useSearchParams } from 'react-router';

export function <Entity>Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      const value = searchInputRef.current?.value ?? '';
      if (value) {
        prev.set('name', value);
      } else {
        prev.delete('name');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    setSearchParams(prev => {
      prev.delete('name');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Search <entities>..."
          defaultValue={name}
          className="pl-9"
        />
      </div>
      <Button type="submit" variant="secondary">
        Search
      </Button>
      {name && (
        <Button type="button" variant="ghost" onClick={handleClear}>
          Clear
        </Button>
      )}
    </form>
  );
}
```

## Table (`components/<Entity>Table.tsx`)

Exports three things: `<Entity>Table`, `<Entities>Skeleton`, `<Entities>Error`. Table reads search params for filters, includes `Pagination` at the bottom.

```tsx
import { Link, useSearchParams } from 'react-router';
import { Search, Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { use<Entities>Suspense } from '../stores/use<Entities>';
import { Pagination } from '@/components/Pagination';

export function <Entities>Skeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          {/* Add column headers */}
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8 w-[50%]" />
            </TableCell>
            {/* Match column count */}
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function <Entities>Error({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive mb-4">Error loading <entities>.</p>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}

export function <Entity>Table() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const { data } = use<Entities>Suspense({ name: name });

  if (data.items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No <entities> found matching your search.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {/* Add column headers */}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.items.map(item => (
            <TableRow key={item.<entityId>}>
              <TableCell className="font-medium">
                <Link to={`/<entities>/${item.<entityId>}`} className="hover:underline">
                  {item.name}
                </Link>
              </TableCell>
              {/* Add data columns */}
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/<entities>/${item.<entityId>}`}>
                      <Search className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/<entities>/${item.<entityId>}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Pagination totalPages={data.totalPages} />
      </div>
    </>
  );
}
```

## Add Form (`components/Add<Entity>Form.tsx`)

Card layout. Form uses `id="form"`, submit button uses `form="form"` (button is outside form element in CardFooter).

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { add<Entity>Schema, type Add<Entity> } from '#/features/<entities>/schemas';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

type Add<Entity>FormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<Add<Entity>>;
};

export function Add<Entity>Form({ isPending, onSubmit }: Add<Entity>FormProps) {
  const navigate = useNavigate();
  const form = useForm<Add<Entity>>({
    resolver: zodResolver(add<Entity>Schema),
    defaultValues: {
      name: '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base"><Entity> Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Name"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Add more Controller fields here */}
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/<entities>')}
          >
            Cancel
          </Button>
          <Button type="submit" form="form" disabled={isPending}>
            Save <Entity>
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
```

## Edit Form (`components/Edit<Entity>Form.tsx`)

Same Card layout as Add, but receives entity data as `defaultValues`. Also exports Skeleton and Error.

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  edit<Entity>Schema,
  type Edit<Entity>,
  type <Entity>,
} from '#/features/<entities>/schemas';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function Edit<Entity>Error({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive mb-4">Failed to load <entity>.</p>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}

export function Edit<Entity>Skeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base"><Entity> Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[60px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Add skeleton rows per field */}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end gap-2 w-full">
          <Skeleton className="h-10 w-[80px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </CardFooter>
    </Card>
  );
}

type Edit<Entity>FormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<Edit<Entity>>;
  <entity>: <Entity>;
};

export function Edit<Entity>Form({ isPending, onSubmit, <entity> }: Edit<Entity>FormProps) {
  const navigate = useNavigate();

  const form = useForm<Edit<Entity>>({
    resolver: zodResolver(edit<Entity>Schema),
    defaultValues: <entity>,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base"><Entity> Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Name"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* Add more Controller fields here */}
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/<entities>')}
          >
            Cancel
          </Button>
          <Button type="submit" form="form" disabled={isPending}>
            Save <Entity>
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
```

## View Card (`components/View<Entity>Card.tsx`)

Read-only display. Exports Card, Skeleton, and Error.

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { type <Entity> } from '#/features/<entities>/schemas';

export function View<Entity>Error({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive mb-4">Failed to load <entity>.</p>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}

export function View<Entity>Skeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base"><Entity> Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[60px]" />
            <Skeleton className="h-6 w-full max-w-md" />
          </div>
          {/* Add skeleton rows per field */}
        </div>
      </CardContent>
    </Card>
  );
}

type View<Entity>CardProps = {
  <entity>: <Entity>;
};

export function View<Entity>Card({ <entity> }: View<Entity>CardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base"><Entity> Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-lg font-medium">{<entity>.name}</p>
          </div>
          {/* Add more labeled fields */}
        </div>
      </CardContent>
    </Card>
  );
}
```
