import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listApplications,
  getApplication,
  addApplication,
  editApplication,
  startReview,
  approve,
  reject,
  withdraw,
  signContract,
  reserve,
} from './applicationsClient';
import { useAuth } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router';
import type {
  AddApplication,
  EditApplication,
  ListApplications,
  RejectApplication,
  WithdrawApplication,
  StartReviewApplication,
  ApproveApplication,
  SignContractApplication,
  ReserveApplication,
} from '#/features/applications/schemas';

export function useApplicationsSuspense({
  pageNumber,
  pageSize,
  propertyId,
  leadId,
  startCreatedAt,
}: Partial<ListApplications> = {}) {
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const queryPage = searchParams.get('page') ?? '1';
  const currentPage = Math.max(1, Math.floor(Number(queryPage)) || 1);
  const params = {
    pageNumber: pageNumber ?? currentPage,
    pageSize: pageSize ?? 10,
    propertyId: propertyId ?? searchParams.get('propertyId') ?? undefined,
    leadId: leadId ?? searchParams.get('leadId') ?? undefined,
    startCreatedAt:
      startCreatedAt ?? searchParams.get('startCreatedAt') ?? undefined,
  };
  return useSuspenseQuery({
    queryKey: ['applications', params],
    queryFn: async () => {
      const token = await getToken();
      return listApplications(params, token);
    },
  });
}

export function useApplicationSuspense(applicationId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['application', applicationId],
    queryFn: async () => {
      const token = await getToken();
      return getApplication(applicationId, token);
    },
  });
}

export function useAddApplication() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddApplication) => {
      const token = await getToken();
      return addApplication(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useEditApplication(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditApplication) => {
      const token = await getToken();
      return editApplication(applicationId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.setQueryData(['application', applicationId], data);
    },
  });
}

export function useStartReview(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: StartReviewApplication) => {
      const token = await getToken();
      return startReview(applicationId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.setQueryData(['application', applicationId], data);
    },
  });
}

export function useApprove(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: ApproveApplication) => {
      const token = await getToken();
      return approve(applicationId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.setQueryData(['application', applicationId], data);
    },
  });
}

export function useReject(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: RejectApplication) => {
      const token = await getToken();
      return reject(applicationId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.setQueryData(['application', applicationId], data);
    },
  });
}

export function useWithdraw(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: WithdrawApplication) => {
      const token = await getToken();
      return withdraw(applicationId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.setQueryData(['application', applicationId], data);
    },
  });
}

export function useSignContract(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: SignContractApplication) => {
      const token = await getToken();
      return signContract(applicationId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.setQueryData(['application', applicationId], data);
    },
  });
}

export function useReserve(applicationId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: ReserveApplication) => {
      const token = await getToken();
      return reserve(applicationId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.setQueryData(['application', applicationId], data);
    },
  });
}
