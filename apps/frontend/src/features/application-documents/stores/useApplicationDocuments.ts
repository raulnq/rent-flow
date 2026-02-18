import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listApplicationDocuments,
  addApplicationDocument,
  editApplicationDocument,
  deleteApplicationDocument,
} from './applicationDocumentsClient';
import { useAuth } from '@clerk/clerk-react';
import type { EditApplicationDocument } from '#/features/application-documents/schemas';

export function useApplicationDocumentsSuspense(
  applicationId: string,
  pageNumber: number = 1,
  pageSize: number = 5
) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['application-documents', applicationId, pageNumber, pageSize],
    queryFn: async () => {
      const token = await getToken();
      return listApplicationDocuments(
        applicationId,
        pageNumber,
        pageSize,
        token
      );
    },
  });
}

export function useAddApplicationDocument(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({
      documentType,
      file,
    }: {
      documentType: string;
      file: File;
    }) => {
      const token = await getToken();
      return addApplicationDocument(applicationId, documentType, file, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['application-documents', applicationId],
      });
    },
  });
}

export function useEditApplicationDocument(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({
      applicationDocumentId,
      data,
    }: {
      applicationDocumentId: string;
      data: EditApplicationDocument;
    }) => {
      const token = await getToken();
      return editApplicationDocument(
        applicationId,
        applicationDocumentId,
        data,
        token
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['application-documents', applicationId],
      });
    },
  });
}

export function useDeleteApplicationDocument(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({
      applicationDocumentId,
    }: {
      applicationDocumentId: string;
    }) => {
      const token = await getToken();
      return deleteApplicationDocument(
        applicationId,
        applicationDocumentId,
        token
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['application-documents', applicationId],
      });
    },
  });
}
