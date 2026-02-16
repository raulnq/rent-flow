import { useNavigate } from 'react-router';
import { type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import type { AddProperty } from '#/features/properties/schemas';
import { useAddProperty } from '../stores/useProperties';
import { AddPropertyForm } from '../components/AddPropertyForm';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { Card } from '@/components/ui/card';

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
      <Card>
        <FormCardHeader
          title="Add Property"
          description="Create a new property."
        />
        <AddPropertyForm isPending={add.isPending} onSubmit={onSubmit} />
        <FormCardFooter
          formId="form"
          saveText="Save Property"
          cancelText="Cancel"
          onCancel={() => navigate('/properties')}
          isPending={add.isPending}
        />
      </Card>
    </div>
  );
}
