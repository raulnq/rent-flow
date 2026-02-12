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

## Field Type Variants

When building forms, use the correct pattern for each field type. Only the basic text `Input` is shown in the Add/Edit templates below — use these variants for other types.

### Nullable string field

```tsx
<Controller
  name="email"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input
        {...field}
        value={field.value ?? ''}
        onChange={e => field.onChange(e.target.value || null)}
        id="email"
        aria-invalid={fieldState.invalid}
        placeholder="Email (optional)"
        disabled={isPending}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Number field

```tsx
<Controller
  name="rentalPrice"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="rentalPrice">Rental Price</FieldLabel>
      <Input
        {...field}
        id="rentalPrice"
        type="number"
        step="0.01"
        value={field.value ?? ''}
        onChange={e => field.onChange(Number(e.target.value))}
        aria-invalid={fieldState.invalid}
        placeholder="0.00"
        disabled={isPending}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Boolean field (Select)

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Controller
  name="hasElevator"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="hasElevator">Has Elevator</FieldLabel>
      <Select
        value={String(field.value)}
        onValueChange={v => field.onChange(v === 'true')}
        disabled={isPending}
      >
        <SelectTrigger id="hasElevator">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Yes</SelectItem>
          <SelectItem value="false">No</SelectItem>
        </SelectContent>
      </Select>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>;
```

### Textarea field (long text)

```tsx
import { Textarea } from '@/components/ui/textarea';

<Controller
  name="notes"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="notes">Notes</FieldLabel>
      <Textarea
        {...field}
        value={field.value ?? ''}
        onChange={e => field.onChange(e.target.value || null)}
        id="notes"
        rows={4}
        aria-invalid={fieldState.invalid}
        placeholder="Notes (optional)"
        disabled={isPending}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>;
```

### Combobox field (foreign key reference)

Use the entity's combobox component (see Combobox section below):

```tsx
<Controller
  name="clientId"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel>Client (Owner)</FieldLabel>
      <ClientCombobox
        value={field.value}
        onChange={field.onChange}
        disabled={isPending}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Grid layout for compact fields

Group related fields in grids:

```tsx
<div className="grid grid-cols-3 gap-6">
  <Controller name="rooms" ... />
  <Controller name="bathrooms" ... />
  <Controller name="parkingSpaces" ... />
</div>

<div className="grid grid-cols-2 gap-6">
  <Controller name="totalArea" ... />
  <Controller name="builtArea" ... />
</div>
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

Read-only display using disabled `Input`/`Textarea` fields. Exports Card, Skeleton, and Error.

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { <Entity> } from '#/features/<entities>/schemas';

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
          {/* One skeleton block per field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-[50px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Add more skeleton rows per field */}
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
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input value={<entity>.name} disabled />
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input value={<entity>.email ?? ''} disabled />
          </Field>
          {/* Use grids for compact display */}
          <div className="grid grid-cols-3 gap-6">
            <Field>
              <FieldLabel>Rooms</FieldLabel>
              <Input value={<entity>.rooms.toString()} disabled />
            </Field>
            {/* ... */}
          </div>
          {/* Boolean fields: display as "Yes"/"No" */}
          <Field>
            <FieldLabel>Has Elevator</FieldLabel>
            <Input value={<entity>.hasElevator ? 'Yes' : 'No'} disabled />
          </Field>
          {/* Use Textarea for long text fields */}
          {/* <Textarea value={<entity>.notes ?? ''} disabled /> */}
        </div>
      </CardContent>
    </Card>
  );
}
```

## Searchable Combobox (`components/<Entity>Combobox.tsx`)

When an entity is referenced as a foreign key in other features' forms, create a searchable combobox. Uses `useQuery` (non-Suspense) with debounced search, display state, and clear button.

```tsx
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Check, ChevronDownIcon, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { use<Entities> } from '../stores/use<Entities>';

type <Entity>ComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string | null;
};

const DEFAULT_LABEL = 'Select <entity>...';

export function <Entity>Combobox({
  value,
  onChange,
  disabled,
  label,
}: <Entity>ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [display, setDisplay] = useState(label || DEFAULT_LABEL);

  const { data, isError, isLoading } = use<Entities>({
    name: debouncedSearch || undefined,
    pageNumber: 1,
    pageSize: 10,
    enabled: open,
  });

  const displayValue = !value ? DEFAULT_LABEL : display;

  return (
    <Popover
      open={open}
      onOpenChange={nextOpen => {
        setOpen(nextOpen);
        if (!nextOpen) setSearch('');
      }}
    >
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between font-normal"
          >
            <span
              className={cn(
                'truncate',
                displayValue === DEFAULT_LABEL && 'text-muted-foreground'
              )}
            >
              {displayValue}
            </span>
            <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        {value && !disabled && (
          <button
            type="button"
            className="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-sm"
            onClick={e => {
              e.stopPropagation();
              onChange('');
              setDisplay(DEFAULT_LABEL);
            }}
          >
            <X className="size-3 opacity-50 hover:opacity-100" />
          </button>
        )}
      </div>

      <PopoverContent
        className="p-0"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search <entities>..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isError ? (
              <div className="py-6 text-center text-sm text-destructive">
                Failed to load <entities>. Please try again.
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-4 animate-spin opacity-50" />
              </div>
            ) : (
              <>
                <CommandEmpty>No <entities> found.</CommandEmpty>
                <CommandGroup>
                  {data?.items.map(item => (
                    <CommandItem
                      key={item.<entityId>}
                      value={item.<entityId>}
                      onSelect={selected => {
                        onChange(selected);
                        setOpen(false);
                        setDisplay(item.name);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {/* Secondary info: DNI, type, etc. */}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          'ml-auto',
                          value === item.<entityId>
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

Key features:

- 300ms debounce on search input via `use-debounce`
- Only fetches when popover opens (`enabled: open`)
- Display text stored separately (shows name, not UUID)
- Clear button (X) appears when a value is selected
- Loading, error, and empty states
- `shouldFilter={false}` — server-side filtering, not client-side

## Multi-Field Search (`components/<Entity>Search.tsx` — advanced variant)

When filtering by comboboxes, dates, or multiple fields instead of just text:

```tsx
import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { <Related>Combobox } from '../../<related>/components/<Related>Combobox';

export function <Entity>Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRelatedId = searchParams.get('relatedId') ?? '';
  const startCreatedAt = searchParams.get('startCreatedAt') ?? '';
  const [relatedId, setRelatedId] = useState(initialRelatedId);
  const dateRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (relatedId) prev.set('relatedId', relatedId);
      else prev.delete('relatedId');
      const dateValue = dateRef.current?.value ?? '';
      if (dateValue) prev.set('startCreatedAt', dateValue);
      else prev.delete('startCreatedAt');
      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setRelatedId('');
    if (dateRef.current) dateRef.current.value = '';
    setSearchParams(prev => {
      prev.delete('relatedId');
      prev.delete('startCreatedAt');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="flex gap-2">
        <div className="w-[250px]">
          <<Related>Combobox value={relatedId} onChange={setRelatedId} />
        </div>
        <Input
          ref={dateRef}
          type="date"
          defaultValue={startCreatedAt}
          className="w-[200px]"
        />
        <Button type="submit" variant="secondary">Search</Button>
        {(relatedId || startCreatedAt) && (
          <Button type="button" variant="ghost" onClick={handleClear}>Clear</Button>
        )}
      </div>
    </form>
  );
}
```

## Action Button with Dialog (`components/<Action>Button.tsx`)

For state transitions (approve, reject, etc.), create a button that opens a dialog with a small form:

```tsx
import { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  approve<Entity>Schema,
  type Approve<Entity>,
} from '#/features/<entities>/schemas';

type ApproveButtonProps = {
  disabled: boolean;
  onApprove: (data: Approve<Entity>) => void;
};

export function ApproveButton({ disabled, onApprove }: ApproveButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm<Approve<Entity>>({
    resolver: zodResolver(approve<Entity>Schema),
    defaultValues: {
      approvedAt: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <>
      <Button
        type="button"
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        variant="default"
        size="sm"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Approve
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve <Entity></DialogTitle>
            <DialogDescription>
              Please confirm the approval date.
            </DialogDescription>
          </DialogHeader>
          <form
            id="approve-form"
            onSubmit={form.handleSubmit(data => {
              onApprove(data);
              setDialogOpen(false);
              form.reset();
            })}
          >
            <Controller
              name="approvedAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="approvedAt">Date</FieldLabel>
                  <Input
                    {...field}
                    id="approvedAt"
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="approve-form">
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## Status Badge (`Badge` variant)

Use `Badge` with variants for status display in tables:

```tsx
import { Badge } from '@/components/ui/badge';

// Map status to badge variant
function statusVariant(status: string) {
  switch (status) {
    case 'Approved':
      return 'success';
    case 'Rejected':
      return 'destructive';
    case 'Under Review':
      return 'secondary';
    default:
      return 'outline';
  }
}

// In table cell:
<Badge variant={statusVariant(item.status)}>{item.status}</Badge>;
```
