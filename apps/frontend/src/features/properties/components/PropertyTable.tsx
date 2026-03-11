import { useSearchParams } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePropertiesSuspense } from '../stores/useProperties';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { LinkTableCell } from '@/components/LinkTableCell';
import { TextTableCell } from '@/components/TextTableCell';
import { NumberTableCell } from '@/components/NumberTableCell';
import { ActionTableCell } from '@/components/ActionTableCell';
import { ViewCellButton } from '@/components/ViewCellButton';
import { EditCellButton } from '@/components/EditCellButton';

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-60">Address</TableHead>
        <TableHead className="hidden md:table-cell">Type</TableHead>
        <TableHead className="hidden md:table-cell">Client (Owner)</TableHead>
        <TableHead className="hidden lg:table-cell">Rental Price</TableHead>
        <TableHead className="hidden lg:table-cell">Rooms</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function PropertiesSkeleton() {
  return (
    <Table>
      <InnerTableHeader />
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-8" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-8" />
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              <Skeleton className="h-8" />
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              <Skeleton className="h-8" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function PropertyTable() {
  const [searchParams] = useSearchParams();
  const address = searchParams.get('address') ?? '';
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = usePropertiesSuspense({ address, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data?.items.map(item => (
            <TableRow key={item.propertyId}>
              <LinkTableCell
                className="font-medium"
                value={item.address}
                link={`/properties/${item.propertyId}`}
              />
              <TextTableCell
                className="hidden md:table-cell"
                value={item.propertyType}
              />
              <TextTableCell
                className="hidden md:table-cell"
                value={item.clientName}
              />
              <NumberTableCell
                className="hidden lg:table-cell"
                value={item.rentalPrice}
              />
              <TextTableCell
                className="hidden lg:table-cell"
                value={item.rooms.toString()}
              />
              <ActionTableCell>
                <ViewCellButton link={`/properties/${item.propertyId}`} />
                <EditCellButton link={`/properties/${item.propertyId}/edit`} />
              </ActionTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
