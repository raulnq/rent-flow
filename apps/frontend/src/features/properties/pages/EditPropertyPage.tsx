import { useNavigate, useParams } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { EditProperty } from '#/features/properties/schemas';
import { useEditProperty, usePropertySuspense } from '../stores/useProperties';
import {
  usePropertyImagesSuspense,
  useAddPropertyImage,
  useDeletePropertyImage,
} from '../stores/usePropertyImages';
import { PropertyEditForm } from '../components/PropertyEditForm';
import { PropertySkeleton } from '../components/PropertySkeleton';
import { ErrorFallback } from '@/components/ErrorFallback';
import {
  ImageUploader,
  ImageUploaderSkeleton,
} from '@/components/ImageUploader';

export function EditPropertyPage() {
  const navigate = useNavigate();
  const { propertyId } = useParams<{ propertyId: string }>();
  const edit = useEditProperty(propertyId!);

  const onSubmit: SubmitHandler<EditProperty> = async data => {
    try {
      await edit.mutateAsync(data);
      toast.success('Property updated successfully');
      navigate('/properties');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save property'
      );
    }
  };

  return (
    <div className="space-y-4">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={({ resetErrorBoundary }) => (
              <ErrorFallback
                resetErrorBoundary={resetErrorBoundary}
                message="Failed to load property"
              />
            )}
          >
            <Suspense fallback={<PropertySkeleton />}>
              <InnerProperty
                isPending={edit.isPending}
                onSubmit={onSubmit}
                onCancel={() => navigate('/properties')}
                propertyId={propertyId!}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={({ resetErrorBoundary }) => (
              <ErrorFallback
                resetErrorBoundary={resetErrorBoundary}
                message="Failed to load images"
              />
            )}
          >
            <Suspense fallback={<ImageUploaderSkeleton />}>
              <ImagesSection propertyId={propertyId!} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
}

type InnerPropertyProps = {
  propertyId: string;
  isPending: boolean;
  onSubmit: SubmitHandler<EditProperty>;
  onCancel: () => void;
};

function InnerProperty({
  isPending,
  onSubmit,
  onCancel,
  propertyId,
}: InnerPropertyProps) {
  const { data } = usePropertySuspense(propertyId);
  return (
    <PropertyEditForm
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={onCancel}
      property={data}
    />
  );
}

function ImagesSection({ propertyId }: { propertyId: string }) {
  const { data } = usePropertyImagesSuspense(propertyId);
  const addImage = useAddPropertyImage(propertyId);
  const deleteImage = useDeletePropertyImage(propertyId);

  const handleAdd = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      try {
        await addImage.mutateAsync(file);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to upload image'
        );
      }
    }
  };

  const handleRemove = async (propertyImageId: string) => {
    try {
      await deleteImage.mutateAsync(propertyImageId);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete image'
      );
    }
  };

  return (
    <ImageUploader
      images={data.map(item => ({
        id: item.propertyImageId,
        path: item.imagePath,
      }))}
      onAdd={handleAdd}
      onRemove={handleRemove}
    />
  );
}
