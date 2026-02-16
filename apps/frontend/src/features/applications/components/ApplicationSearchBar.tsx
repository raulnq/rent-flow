import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { PropertyCombobox } from '@/features/properties/components/PropertyCombobox';
import { LeadCombobox } from '@/features/leads/components/LeadCombobox';
import { SearchBar } from '@/components/SearchBar';

export function ApplicationSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPropertyId = searchParams.get('propertyId') ?? '';
  const initialLeadId = searchParams.get('leadId') ?? '';
  const startCreatedAt = searchParams.get('startCreatedAt') ?? '';
  const [propertyId, setPropertyId] = useState(initialPropertyId);
  const [leadId, setLeadId] = useState(initialLeadId);
  const startCreatedAtInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      const dateValue = startCreatedAtInputRef.current?.value ?? '';

      if (propertyId) {
        prev.set('propertyId', propertyId);
      } else {
        prev.delete('propertyId');
      }

      if (leadId) {
        prev.set('leadId', leadId);
      } else {
        prev.delete('leadId');
      }

      if (dateValue) {
        prev.set('startCreatedAt', dateValue);
      } else {
        prev.delete('startCreatedAt');
      }

      prev.set('page', '1');
      return prev;
    });
  };

  const handleClear = () => {
    setPropertyId('');
    setLeadId('');
    if (startCreatedAtInputRef.current) {
      startCreatedAtInputRef.current.value = '';
    }
    setSearchParams(prev => {
      prev.delete('propertyId');
      prev.delete('leadId');
      prev.delete('startCreatedAt');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      showClearButton={!!(propertyId || leadId || startCreatedAt)}
      onClear={handleClear}
    >
      <div className="w-[250px]">
        <PropertyCombobox value={propertyId} onChange={setPropertyId} />
      </div>
      <div className="w-[250px]">
        <LeadCombobox value={leadId} onChange={setLeadId} />
      </div>
      <Input
        ref={startCreatedAtInputRef}
        type="date"
        placeholder="Start Date..."
        defaultValue={startCreatedAt}
        className="w-[200px]"
      />
    </SearchBar>
  );
}
