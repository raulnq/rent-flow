import { useSearchParams } from 'react-router';
import { Pencil, Trash2 } from 'lucide-react';
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
import {
  useApplicationDocumentsSuspense,
  useEditApplicationDocument,
  useDeleteApplicationDocument,
} from '../stores/useApplicationDocuments';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { EditDialog } from './EditDialog';
import { DeleteDialog } from './DeleteDialog';
import { useState } from 'react';
import type {
  ApplicationDocument,
  EditApplicationDocument,
} from '#/features/application-documents/schemas';
import { toast } from 'sonner';

export function DocumentsSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document Type</TableHead>
          <TableHead>File Name</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="w-[120px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-8 w-[120px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[150px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-[200px]" />
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

export function DocumentsTable({ applicationId }: { applicationId: string }) {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('documents_page') ?? '1';
  const pageNumber = Math.max(1, Math.floor(Number(page)) || 1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApplicationDocument, setSelectedApplicationDocument] =
    useState<ApplicationDocument | null>(null);

  const { data } = useApplicationDocumentsSuspense(
    applicationId,
    pageNumber,
    5
  );

  const editMutation = useEditApplicationDocument(applicationId);
  const deleteMutation = useDeleteApplicationDocument(applicationId);

  const handleDelete = async () => {
    if (!selectedApplicationDocument) return;
    try {
      await deleteMutation.mutateAsync({
        applicationDocumentId:
          selectedApplicationDocument.applicationDocumentId,
      });
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete document'
      );
    }
  };

  const handleEdit = async (data: EditApplicationDocument) => {
    if (!selectedApplicationDocument) return;
    try {
      await editMutation.mutateAsync({
        applicationDocumentId:
          selectedApplicationDocument.applicationDocumentId,
        data,
      });
      toast.success('Document updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update document'
      );
    }
  };

  const openEditDialog = (document: ApplicationDocument) => {
    setSelectedApplicationDocument(document);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (document: ApplicationDocument) => {
    setSelectedApplicationDocument(document);
    setDeleteDialogOpen(true);
  };

  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setSelectedApplicationDocument(null);
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setSelectedApplicationDocument(null);
    }
  };

  if (data.items.length === 0) {
    return <NoMatchingItems />;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document Type</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map(item => (
            <TableRow key={item.applicationDocumentId}>
              <TableCell className="font-medium">{item.documentType}</TableCell>
              <TableCell>{item.fileName}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} pageParamName="documents_page" />

      <EditDialog
        key={`${selectedApplicationDocument?.applicationDocumentId ?? 'new'}-document-edit`}
        notes={selectedApplicationDocument?.notes}
        isOpen={editDialogOpen}
        onOpenChange={handleEditDialogChange}
        onEdit={handleEdit}
      />

      <DeleteDialog
        key={`${selectedApplicationDocument?.applicationDocumentId ?? 'new'}-document-delete`}
        fileName={selectedApplicationDocument?.fileName}
        isOpen={deleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        onDelete={handleDelete}
      />
    </>
  );
}
