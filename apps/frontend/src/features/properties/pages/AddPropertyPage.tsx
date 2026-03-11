import { useNavigate } from 'react-router';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddProperty } from '#/features/properties/schemas';
import { useAddProperty } from '../stores/useProperties';
import { AddPropertyForm } from '../components/AddPropertyForm';

export function AddPropertyPage() {
  const navigate = useNavigate();
  const add = useAddProperty();

  const onSubmit: SubmitHandler<AddProperty> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Property created successfully');
      navigate(`/properties/${result.propertyId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save property'
      );
    }
  };

  return (
    <div className="space-y-4">
      <AddPropertyForm
        isPending={add.isPending}
        onSubmit={onSubmit}
        onCancel={() => navigate('/properties')}
      />
    </div>
  );
}
