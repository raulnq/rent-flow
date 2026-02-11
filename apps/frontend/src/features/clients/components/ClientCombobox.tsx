import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useClients, useClient } from '@/features/clients/stores/useClients';

type ClientComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function ClientCombobox({
  value,
  onChange,
  disabled,
  placeholder = 'Select client...',
}: ClientComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isFetching, isError } = useClients({
    name: debouncedSearch || undefined,
    pageNumber: 1,
    pageSize: 10,
    enabled: open,
  });

  const {
    data: dataClient,
    isLoading: isLoadingClient,
    isError: isClientError,
  } = useClient(value || undefined);
  const displayName = dataClient?.name;

  return (
    <Popover
      open={open}
      onOpenChange={nextOpen => {
        setOpen(nextOpen);
        if (!nextOpen) setSearch('');
      }}
    >
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
              !displayName && 'text-muted-foreground',
              isClientError && 'text-destructive'
            )}
          >
            {isLoadingClient
              ? 'Loading...'
              : isClientError
                ? 'Error loading client'
                : (displayName ?? placeholder)}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search clients..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isError ? (
              <div className="py-6 text-center text-sm text-destructive">
                Failed to load clients. Please try again.
              </div>
            ) : isFetching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-4 animate-spin opacity-50" />
              </div>
            ) : (
              <>
                <CommandEmpty>No clients found.</CommandEmpty>
                <CommandGroup>
                  {data?.items.map(c => (
                    <CommandItem
                      key={c.clientId}
                      value={c.clientId}
                      onSelect={selected => {
                        onChange(selected);
                        setOpen(false);
                      }}
                    >
                      {c.name}
                      <Check
                        className={cn(
                          'ml-auto',
                          value === c.clientId ? 'opacity-100' : 'opacity-0'
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
