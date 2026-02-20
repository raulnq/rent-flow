import { useId, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Check, ChevronDownIcon, Loader2, X } from 'lucide-react';
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
import { useClients } from '@/features/clients/stores/useClients';

type ClientComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string | null;
};

const DEFAULT_LABEL = 'Select client...';

export function ClientCombobox({
  value,
  onChange,
  disabled,
  label,
}: ClientComboboxProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [display, setDisplay] = useState(label || DEFAULT_LABEL);
  const { data, isError, isLoading } = useClients({
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
            aria-controls={listId}
            disabled={disabled}
            className="w-full justify-between font-normal"
          >
            <span
              className={cn(
                'truncate',
                displayValue == DEFAULT_LABEL && 'text-muted-foreground'
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
            placeholder="Search clients..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList id={listId}>
            {isError ? (
              <div className="py-6 text-center text-sm text-destructive">
                Failed to load clients. Please try again.
              </div>
            ) : isLoading ? (
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
                        setDisplay(c.name);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-xs text-muted-foreground">
                          DNI: {c.dni}
                        </span>
                      </div>
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
