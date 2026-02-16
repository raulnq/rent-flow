import { useNavigate } from 'react-router';
import { type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { type AddApplication } from '#/features/applications/schemas';
import { useAddApplication } from '../stores/useApplications';
import { AddApplicationForm } from '../components/AddApplicationForm';
import { FormCardHeader } from '@/components/FormCardHeader';
import { FormCardFooter } from '@/components/FormCardFooter';
import { Card } from '@/components/ui/card';

export function AddApplicationPage() {
  const navigate = useNavigate();
  const add = useAddApplication();

  const onSubmit: SubmitHandler<AddApplication> = async data => {
    try {
      const result = await add.mutateAsync(data);
      toast.success('Application created successfully');
      navigate(`/applications/${result.applicationId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save application'
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <FormCardHeader
          title="Add Application"
          description="Create a new rental application."
        />
        <AddApplicationForm isPending={add.isPending} onSubmit={onSubmit} />
        <FormCardFooter
          formId="form"
          saveText="Save Application"
          cancelText="Cancel"
          onCancel={() => navigate('/applications')}
          isPending={add.isPending}
        />
      </Card>
    </div>
  );
}
