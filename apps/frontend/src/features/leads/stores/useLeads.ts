import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { listLeads, getLead, addLead, editLead } from './leadsClient';
import { useAuth } from '@clerk/clerk-react';
import type { AddLead, EditLead, ListLeads } from '#/features/leads/schemas';

export function useLeadsSuspense({
  pageNumber,
  pageSize,
  name,
}: Partial<ListLeads> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
    name,
  };
  return useSuspenseQuery({
    queryKey: ['leads', params],
    queryFn: async () => {
      const token = await getToken();
      return listLeads(params, token);
    },
  });
}

export function useLeadSuspense(leadId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['lead', leadId],
    queryFn: async () => {
      const token = await getToken();
      return getLead(leadId, token);
    },
  });
}

export function useLeads({
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
    queryKey: ['leads', 'search', params],
    queryFn: async () => {
      const token = await getToken();
      return listLeads(params, token);
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useAddLead() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddLead) => {
      const token = await getToken();
      return addLead(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useEditLead(leadId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditLead) => {
      const token = await getToken();
      return editLead(leadId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.setQueryData(['lead', leadId], data);
    },
  });
}
