import { useSearchParams } from 'react-router';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import {
  useApplicationDocumentsSuspense,
  useEditApplicationDocument,
  useDeleteApplicationDocument,
  useGetDownloadUrl,
} from '../stores/useApplicationDocuments';
import { Pagination } from '@/components/Pagination';
import { NoMatchingItems } from '@/components/NoMatchingItems';
import { TextTableCell } from '@/components/TextTableCell';
import { ActionTableCell } from '@/components/ActionTableCell';
import { DocumentEditAction } from './DocumentEditAction';
import { DocumentDeleteAction } from './DocumentDeleteAction';
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
  const { getUrl, isLoading } = useGetDownloadUrl(applicationId);

  const handleView = async (document: ApplicationDocument) => {
    try {
      const result = await getUrl(document.applicationDocumentId);
      if (result?.url) {
        window.open(result.url, '_blank');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to get download URL'
      );
    }
  };

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
              <TextTableCell
                value={item.documentType}
                className="font-medium"
              />
              <TextTableCell value={item.fileName} />
              <ActionTableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleView(item)}
                  disabled={isLoading}
                >
                  <Eye className="h-4 w-4" />
                </Button>
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
              </ActionTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={data.totalPages} pageParamName="documents_page" />

      <DocumentEditAction
        key={`${selectedApplicationDocument?.applicationDocumentId ?? 'new'}-document-edit`}
        notes={selectedApplicationDocument?.notes}
        isOpen={editDialogOpen}
        onOpenChange={handleEditDialogChange}
        onEdit={handleEdit}
        isPending={editMutation.isPending}
      />

      <DocumentDeleteAction
        key={`${selectedApplicationDocument?.applicationDocumentId ?? 'new'}-document-delete`}
        fileName={selectedApplicationDocument?.fileName}
        isOpen={deleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        onDelete={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
