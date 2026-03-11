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
import { useApplicationsSuspense } from '../stores/useApplications';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { LinkTableCell } from '@/components/LinkTableCell';
import { TextTableCell } from '@/components/TextTableCell';
import { BadgeTableCell } from '@/components/BadgeTableCell';
import { DateTableCell } from '@/components/DateTableCell';
import { ActionTableCell } from '@/components/ActionTableCell';
import { EditCellButton } from '@/components/EditCellButton';
import { getStatusVariant } from '../utils/status-variants';

function InnerTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-60">Property</TableHead>
        <TableHead className="hidden md:table-cell">Lead</TableHead>
        <TableHead className="hidden md:table-cell">Status</TableHead>
        <TableHead className="hidden lg:table-cell">Created</TableHead>
        <TableHead className="w-20">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export function ApplicationsSkeleton() {
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
              <Skeleton className="h-6 w-[80px]" />
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

export function ApplicationTable() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId') ?? undefined;
  const leadId = searchParams.get('leadId') ?? undefined;
  const startCreatedAt = searchParams.get('startCreatedAt') ?? undefined;
  const page = searchParams.get('page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useApplicationsSuspense({
    propertyId,
    leadId,
    startCreatedAt,
    pageNumber,
  });

  if (data.items.length === 0) {
    return <NoMatchingItems />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <InnerTableHeader />
        <TableBody>
          {data?.items.map(item => (
            <TableRow key={item.applicationId}>
              <LinkTableCell
                className="font-medium"
                value={item.propertyAddress ?? 'N/A'}
                link={`/applications/${item.applicationId}`}
              />
              <TextTableCell
                className="hidden md:table-cell"
                value={item.leadName}
              />
              <BadgeTableCell
                className="hidden md:table-cell"
                variant={getStatusVariant(item.status)}
              >
                {item.status}
              </BadgeTableCell>
              <DateTableCell
                className="hidden lg:table-cell"
                value={item.createdAt}
              />
              <ActionTableCell>
                <EditCellButton
                  link={`/applications/${item.applicationId}/edit`}
                />
              </ActionTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} />
    </div>
  );
}
