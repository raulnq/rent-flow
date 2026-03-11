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
import { useLeadsSuspense } from '../stores/useLeads';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { TextTableCell } from '@/components/TextTableCell';
import { ActionTableCell } from '@/components/ActionTableCell';
import { ViewCellButton } from '@/components/ViewCellButton';
import { EditCellButton } from '@/components/EditCellButton';
import { LinkTableCell } from '@/components/LinkTableCell';

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-60">Name</TableHead>
        <TableHead className="hidden md:table-cell">DNI</TableHead>
        <TableHead className="hidden md:table-cell">Phone</TableHead>
        <TableHead className="hidden lg:table-cell">Email</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function LeadsSkeleton() {
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
            <TableCell>
              <Skeleton className="h-8" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function LeadTable() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useLeadsSuspense({ name, pageNumber });

  if (data.items.length === 0) return <NoMatchingItems />;

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data?.items.map(item => (
            <TableRow key={item.leadId}>
              <LinkTableCell
                className="font-medium"
                value={item.name}
                link={`/leads/${item.leadId}`}
              />
              <TextTableCell
                className="hidden md:table-cell"
                value={item.dni}
              />
              <TextTableCell
                className="hidden md:table-cell"
                value={item.phone}
              />
              <TextTableCell
                className="hidden lg:table-cell"
                value={item.email}
              />
              <ActionTableCell>
                <ViewCellButton link={`/leads/${item.leadId}`} />
                <EditCellButton link={`/leads/${item.leadId}/edit`} />
              </ActionTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
