import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { SearchCombobox } from '@/components/SearchCombobox';
import { useProperties } from '../stores/useProperties';

type PropertyComboboxProps = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string | null;
};

export function PropertyCombobox({
  value,
  onChange,
  disabled,
  label,
}: PropertyComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError } = useProperties({
    address: debouncedSearch || undefined,
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
      defaultLabel="Select property..."
      searchPlaceholder="Search properties..."
      errorMessage="Failed to load properties. Please try again."
      emptyMessage="No properties found."
      items={data?.items}
      isLoading={isLoading}
      isError={isError}
      open={open}
      onOpenChange={setOpen}
      search={search}
      onSearchChange={setSearch}
      getItemId={item => item.propertyId}
      getItemLabel={item => item.address}
      renderItem={item => (
        <div className="flex flex-col">
          <span className="font-medium">{item.address}</span>
          <span className="text-xs text-muted-foreground">
            {item.clientName} - ${item.rentalPrice}
          </span>
        </div>
      )}
    />
  );
}
