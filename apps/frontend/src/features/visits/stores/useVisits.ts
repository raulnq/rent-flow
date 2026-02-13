import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listVisits,
  addVisit,
  editVisit,
  completeVisit,
  cancelVisit,
  noAttendVisit,
} from './visitsClient';
import { useAuth } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router';
import type {
  AddVisit,
  EditVisit,
  ListVisits,
  CancelVisit,
} from '#/features/visits/schemas';

export function useVisitsSuspense(
  applicationId: string,
  { pageNumber, pageSize }: Partial<ListVisits> = {}
) {
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const queryPage = searchParams.get('page') ?? '1';
  const currentPage = Math.max(1, Math.floor(Number(queryPage)) || 1);
  const params = {
    pageNumber: pageNumber ?? currentPage,
    pageSize: pageSize ?? 5,
  };
  return useSuspenseQuery({
    queryKey: ['visits', applicationId, params],
    queryFn: async () => {
      const token = await getToken();
      return listVisits(applicationId, params, token);
    },
  });
}

export function useAddVisit(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddVisit) => {
      const token = await getToken();
      return addVisit(applicationId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits', applicationId] });
    },
  });
}

export function useEditVisit(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({
      visitId,
      data,
    }: {
      visitId: string;
      data: EditVisit;
    }) => {
      const token = await getToken();
      return editVisit(applicationId, visitId, data, token);
    },
    onSuccess: updatedVisit => {
      queryClient.setQueryData(['visit', updatedVisit.visitId], updatedVisit);
      queryClient.invalidateQueries({ queryKey: ['visits', applicationId] });
    },
  });
}

export function useCompleteVisit(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (visitId: string) => {
      const token = await getToken();
      return completeVisit(applicationId, visitId, token);
    },
    onSuccess: updatedVisit => {
      queryClient.setQueryData(['visit', updatedVisit.visitId], updatedVisit);
      queryClient.invalidateQueries({ queryKey: ['visits', applicationId] });
    },
  });
}

export function useCancelVisit(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async ({
      visitId,
      data,
    }: {
      visitId: string;
      data: CancelVisit;
    }) => {
      const token = await getToken();
      return cancelVisit(applicationId, visitId, data, token);
    },
    onSuccess: updatedVisit => {
      queryClient.setQueryData(['visit', updatedVisit.visitId], updatedVisit);
      queryClient.invalidateQueries({ queryKey: ['visits', applicationId] });
    },
  });
}

export function useNoAttendVisit(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (visitId: string) => {
      const token = await getToken();
      return noAttendVisit(applicationId, visitId, token);
    },
    onSuccess: updatedVisit => {
      queryClient.setQueryData(['visit', updatedVisit.visitId], updatedVisit);
      queryClient.invalidateQueries({ queryKey: ['visits', applicationId] });
    },
  });
}
