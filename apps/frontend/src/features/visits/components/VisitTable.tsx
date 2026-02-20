import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/Pagination';
import { XCircle, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import {
  useVisitsSuspense,
  useEditVisit,
  useCancelVisit,
  useCompleteVisit,
  useNoAttendVisit,
} from '../stores/useVisits';
import type { Visit, CancelVisit, EditVisit } from '#/features/visits/schemas';
import { Badge } from '@/components/ui/badge';
import { CompleteButton } from './CompleteButton';
import { NoAttendButton } from './NoAttendButton';
import { EditDialog } from './EditDialog';
import { CancelDialog } from './CancelDialog';
import { NoMatchingItems } from '@/components/NoMatchingItems';

const STATUS_VARIANTS: Record<
  string,
  'default' | 'secondary' | 'success' | 'destructive' | 'outline'
> = {
  Scheduled: 'default',
  Completed: 'success',
  Cancelled: 'destructive',
  'Did Not Attend': 'outline',
};

export function VisitsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Scheduled At</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="w-[200px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8 w-[150px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[60%]" />
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

type VisitTableProps = {
  applicationId: string;
};

export function VisitTable({ applicationId }: VisitTableProps) {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('visits_page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const { data } = useVisitsSuspense(applicationId, {
    pageNumber,
    pageSize: 5,
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const editMutation = useEditVisit(applicationId);
  const cancelMutation = useCancelVisit(applicationId);
  const completeMutation = useCompleteVisit(applicationId);
  const noAttendMutation = useNoAttendVisit(applicationId);

  const handleComplete = async (visitId: string) => {
    try {
      await completeMutation.mutateAsync(visitId);
      toast.success('Visit marked as completed');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to complete visit'
      );
    }
  };

  const handleNoAttend = async (visitId: string) => {
    try {
      await noAttendMutation.mutateAsync(visitId);
      toast.success('Visit marked as did not attend');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to mark as no attend'
      );
    }
  };

  const handleEdit = async (data: EditVisit) => {
    if (!selectedVisit) return;
    try {
      await editMutation.mutateAsync({ visitId: selectedVisit.visitId, data });
      toast.success('Visit updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update visit'
      );
    }
  };

  const handleCancel = async (data: CancelVisit) => {
    if (!selectedVisit) return;
    try {
      await cancelMutation.mutateAsync({
        visitId: selectedVisit.visitId,
        data,
      });
      toast.success('Visit cancelled successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to cancel visit'
      );
    }
  };

  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setSelectedVisit(null);
    }
  };

  const handleCancelDialogChange = (open: boolean) => {
    setCancelDialogOpen(open);
    if (!open) {
      setSelectedVisit(null);
    }
  };

  const openEditDialog = (visit: Visit) => {
    setSelectedVisit(visit);
    setEditDialogOpen(true);
  };

  const openCancelDialog = (visit: Visit) => {
    setSelectedVisit(visit);
    setCancelDialogOpen(true);
  };

  if (data.items.length === 0) {
    return <NoMatchingItems />;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Scheduled At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map(visit => (
            <TableRow key={visit.visitId}>
              <TableCell>
                {new Date(visit.scheduledAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANTS[visit.status] || 'default'}>
                  {visit.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <CompleteButton
                    onClick={() => handleComplete(visit.visitId)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openCancelDialog(visit)}
                    title="Cancel"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                  <NoAttendButton
                    onClick={() => handleNoAttend(visit.visitId)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(visit)}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} pageParamName="visits_page" />
      <EditDialog
        key={`${selectedVisit?.visitId ?? 'new'}-visit-edit`} // remount component when selected visit changes
        notes={selectedVisit?.notes}
        scheduledAt={selectedVisit?.scheduledAt}
        isOpen={editDialogOpen}
        onOpenChange={handleEditDialogChange}
        onEdit={handleEdit}
      />
      <CancelDialog
        isOpen={cancelDialogOpen}
        onOpenChange={handleCancelDialogChange}
        onCancel={handleCancel}
      />
    </>
  );
}
