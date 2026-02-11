import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listProperties,
  getProperty,
  addProperty,
  editProperty,
} from './propertiesClient';
import { useAuth } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router';
import type {
  AddProperty,
  EditProperty,
  ListProperties,
} from '#/features/properties/schemas';

export function usePropertiesSuspense({
  pageNumber,
  pageSize,
  address,
}: Partial<ListProperties> = {}) {
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const queryPage = searchParams.get('page') ?? '1';
  const currentPage = Math.max(1, Math.floor(Number(queryPage)) || 1);
  const params = {
    pageNumber: pageNumber ?? currentPage,
    pageSize: pageSize ?? 10,
    address,
  };
  return useSuspenseQuery({
    queryKey: ['properties', params],
    queryFn: async () => {
      const token = await getToken();
      return listProperties(params, token);
    },
  });
}

export function usePropertySuspense(propertyId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const token = await getToken();
      return getProperty(propertyId, token);
    },
  });
}

export function useAddProperty() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: AddProperty) => {
      const token = await getToken();
      return addProperty(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useEditProperty(propertyId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: EditProperty) => {
      const token = await getToken();
      return editProperty(propertyId, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.setQueryData(['property', propertyId], data);
    },
  });
}
