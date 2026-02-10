import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { listClients, getClient, addClient, editClient } from './clientsClient';
import { useAuth } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router';
import type {
  AddClient,
  EditClient,
  ListClients,
} from '#/features/clients/schemas';

export function useClientsSuspense({
  pageNumber,
  pageSize,
  name,
}: Partial<ListClients> = {}) {
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const queryPage = searchParams.get('page') ?? '1';
  const currentPage = Math.max(1, Math.floor(Number(queryPage)) || 1);
  const params = {
    pageNumber: pageNumber ?? currentPage,
    pageSize: pageSize ?? 10,
    name,
  };
  return useSuspenseQuery({
    queryKey: ['clients', params],
    queryFn: async () => {
      const token = await getToken();
      return listClients(params, token);
    },
  });
}

export function useClientSuspense(clientId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const token = await getToken();
      return getClient(clientId, token);
    },
  });
}

export function useAddClient() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddClient) => {
      const token = await getToken();
      return addClient(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useEditClient(clientId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditClient) => {
      const token = await getToken();
      return editClient(clientId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.setQueryData(['client', clientId], data);
    },
  });
}
