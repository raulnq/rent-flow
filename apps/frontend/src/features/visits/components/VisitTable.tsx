import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/Pagination';
import { CheckCircle, Pencil, UserX, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  useVisitsSuspense,
  useEditVisit,
  useCancelVisit,
  useCompleteVisit,
  useNoAttendVisit,
} from '../stores/useVisits';
import type { Visit, CancelVisit, EditVisit } from '#/features/visits/schemas';
import { VisitEditAction } from './VisitEditAction';
import { VisitCancelAction } from './VisitCancelAction';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { BadgeTableCell } from '@/components/BadgeTableCell';
import { ActionTableCell } from '@/components/ActionTableCell';
import { DateTableCell } from '@/components/DateTableCell';
import { ControlledConfirmDialog } from '@/components/ControlledConfirmDialog';

const STATUS_VARIANTS: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  Scheduled: 'default',
  Completed: 'secondary',
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
  const [editDialogOpen, setVisitEditActionOpen] = useState(false);
  const [cancelDialogOpen, setVisitCancelActionOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [noAttendDialogOpen, setNoAttendDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const editMutation = useEditVisit(applicationId);
  const cancelMutation = useCancelVisit(applicationId);
  const completeMutation = useCompleteVisit(applicationId);
  const noAttendMutation = useNoAttendVisit(applicationId);

  const handleComplete = async () => {
    if (!selectedVisit) return;
    try {
      await completeMutation.mutateAsync(selectedVisit.visitId);
      toast.success('Visit marked as completed');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to complete visit'
      );
    }
  };

  const handleNoAttend = async () => {
    if (!selectedVisit) return;
    try {
      await noAttendMutation.mutateAsync(selectedVisit.visitId);
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

  const openDialog = (visit: Visit, setOpen: (open: boolean) => void) => {
    setSelectedVisit(visit);
    setOpen(true);
  };

  const createDialogChangeHandler = (setOpen: (open: boolean) => void) => {
    return (open: boolean) => {
      setOpen(open);
      if (!open) {
        setSelectedVisit(null);
      }
    };
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
              <DateTableCell value={visit.scheduledAt} />
              <BadgeTableCell
                variant={STATUS_VARIANTS[visit.status] || 'default'}
              >
                {visit.status}
              </BadgeTableCell>
              <ActionTableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDialog(visit, setCompleteDialogOpen)}
                  title="Complete"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDialog(visit, setNoAttendDialogOpen)}
                  title="Did Not Attend"
                >
                  <UserX className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDialog(visit, setVisitCancelActionOpen)}
                  title="Cancel"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDialog(visit, setVisitEditActionOpen)}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </ActionTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} pageParamName="visits_page" />
      <ControlledConfirmDialog
        label="Complete"
        description="Are you sure you want to mark this visit as completed?"
        open={completeDialogOpen}
        onOpenChange={createDialogChangeHandler(setCompleteDialogOpen)}
        onConfirm={handleComplete}
        isPending={completeMutation.isPending}
      />
      <ControlledConfirmDialog
        label="Did Not Attend"
        description="Are you sure you want to mark this visit as did not attend?"
        open={noAttendDialogOpen}
        onOpenChange={createDialogChangeHandler(setNoAttendDialogOpen)}
        onConfirm={handleNoAttend}
        isPending={noAttendMutation.isPending}
      />
      <VisitEditAction
        key={`${selectedVisit?.visitId ?? 'new'}-visit-edit`}
        notes={selectedVisit?.notes}
        scheduledAt={selectedVisit?.scheduledAt}
        isOpen={editDialogOpen}
        onOpenChange={createDialogChangeHandler(setVisitEditActionOpen)}
        onEdit={handleEdit}
        isPending={editMutation.isPending}
      />
      <VisitCancelAction
        isOpen={cancelDialogOpen}
        onOpenChange={createDialogChangeHandler(setVisitCancelActionOpen)}
        onCancel={handleCancel}
        isPending={cancelMutation.isPending}
      />
    </>
  );
}
