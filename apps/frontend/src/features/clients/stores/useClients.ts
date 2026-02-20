import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { listClients, getClient, addClient, editClient } from './clientsClient';
import { useAuth } from '@clerk/clerk-react';
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
  const params = {
    pageNumber: pageNumber ?? 1,
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

export function useClients({
  name,
  enabled,
  pageNumber = 1,
  pageSize = 10,
}: {
  name?: string;
  enabled: boolean;
  pageNumber?: number;
  pageSize?: number;
}) {
  const { getToken } = useAuth();
  const params = { pageNumber, pageSize, name };
  return useQuery({
    queryKey: ['clients', 'search', params],
    queryFn: async () => {
      const token = await getToken();
      return listClients(params, token);
    },
    placeholderData: keepPreviousData,
    enabled,
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
