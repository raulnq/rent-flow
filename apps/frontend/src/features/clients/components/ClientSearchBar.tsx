import { SearchBar } from '@/components/SearchBar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRef } from 'react';
import { useSearchParams } from 'react-router';

export function ClientSearchBar() {
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
    <SearchBar
      onSearch={handleSearch}
      showClearButton={!!name}
      onClear={handleClear}
    >
      <div className="relative w-[250px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          placeholder="Search by name..."
          defaultValue={name}
          className="pl-9"
        />
      </div>
    </SearchBar>
  );
}
