import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { SearchCombobox } from '@/components/SearchCombobox';
import { useLeads } from '../stores/useLeads';

type LeadComboboxProps = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string | null;
};

export function LeadCombobox({
  value,
  onChange,
  disabled,
  label,
}: LeadComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError } = useLeads({
    name: debouncedSearch || undefined,
    pageNumber: 1,
    pageSize: 10,
    enabled: open,
  });

  return (
    <SearchCombobox
      value={value}
      onChange={onChange}
      disabled={disabled}
      label={label}
      defaultLabel="Select lead..."
      searchPlaceholder="Search leads..."
      errorMessage="Failed to load leads. Please try again."
      emptyMessage="No leads found."
      items={data?.items}
      isLoading={isLoading}
      isError={isError}
      open={open}
      onOpenChange={setOpen}
      search={search}
      onSearchChange={setSearch}
      getItemId={item => item.leadId}
      getItemLabel={item => item.name}
      renderItem={item => (
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          <span className="text-xs text-muted-foreground">DNI: {item.dni}</span>
        </div>
      )}
    />
  );
}
