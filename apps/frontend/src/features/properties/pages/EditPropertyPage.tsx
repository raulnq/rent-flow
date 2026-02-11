import { useNavigate, useParams } from 'react-router';
import { type SubmitHandler } from 'react-hook-form';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { EditProperty } from '#/features/properties/schemas';
import { useEditProperty, usePropertySuspense } from '../stores/useProperties';
import {
  EditPropertyForm,
  EditPropertySkeleton,
  EditPropertyError,
} from '../components/EditPropertyForm';
import { PropertyHeader } from '../components/PropertyHeader';

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
      <PropertyHeader
        onBack={() => navigate('/properties')}
        title="Edit Property"
        description="Edit an existing property."
      />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={EditPropertyError}>
            <Suspense fallback={<EditPropertySkeleton />}>
              <InnerProperty
                isPending={edit.isPending}
                onSubmit={onSubmit}
                propertyId={propertyId!}
              />
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
};

function InnerProperty({
  isPending,
  onSubmit,
  propertyId,
}: InnerPropertyProps) {
  const { data } = usePropertySuspense(propertyId);
  return (
    <EditPropertyForm
      isPending={isPending}
      onSubmit={onSubmit}
      property={data}
    />
  );
}
