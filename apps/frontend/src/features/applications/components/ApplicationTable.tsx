import { Link, useSearchParams } from 'react-router';
import { Pencil } from 'lucide-react';
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
import { useApplicationsSuspense } from '../stores/useApplications';
import { Pagination } from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { getStatusVariant } from '../utils/status-variants';
import { NoMatchingItems } from '@/components/NoMatchingItems';

export function ApplicationsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property</TableHead>
          <TableHead>Lead</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8 w-[60%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[50%]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-full" />
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
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.items.map(item => (
            <TableRow key={item.applicationId}>
              <TableCell className="font-medium">
                <Link
                  to={`/applications/${item.applicationId}/edit`}
                  className="hover:underline"
                >
                  {item.propertyAddress ?? 'N/A'}
                </Link>
              </TableCell>
              <TableCell>{item.leadName ?? 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/applications/${item.applicationId}/edit`}>
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
