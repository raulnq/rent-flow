import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  listPropertyImages,
  addPropertyImage,
  deletePropertyImage,
} from './propertyImagesClient';
import { useAuth } from '@clerk/clerk-react';

export function usePropertyImagesSuspense(propertyId: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['property-images', propertyId],
    queryFn: async () => {
      const token = await getToken();
      return listPropertyImages(propertyId, token);
    },
  });
}

export function useAddPropertyImage(propertyId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (file: File) => {
      const token = await getToken();
      return addPropertyImage(propertyId, file, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['property-images', propertyId],
      });
    },
  });
}

export function useDeletePropertyImage(propertyId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (propertyImageId: string) => {
      const token = await getToken();
      return deletePropertyImage(propertyId, propertyImageId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['property-images', propertyId],
      });
    },
  });
}
