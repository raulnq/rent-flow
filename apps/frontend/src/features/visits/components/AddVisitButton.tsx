import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import { Plus } from 'lucide-react';
import { z } from 'zod';
import type { AddVisit } from '#/features/visits/schemas';

const addVisitFormSchema = z.object({
  scheduledAt: z.string().min(1, 'Scheduled time is required'),
});

type AddButtonProps = {
  onAdd: (data: AddVisit) => Promise<void>;
  isPending: boolean;
};

export function AddVisitButton({ onAdd, isPending }: AddButtonProps) {
  return (
    <UncontrolledFormDialog
      schema={addVisitFormSchema}
      defaultValues={{
        scheduledAt: new Date().toISOString().slice(0, 16),
      }}
      onSubmit={onAdd}
      isPending={isPending}
      label="Add Visit"
      saveLabel="Add"
      description="Schedule a new visit for this application."
      icon={<Plus className="h-4 w-4" />}
    >
      {form => (
        <Controller
          name="scheduledAt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="scheduledAt">Scheduled At</FieldLabel>
              <Input
                {...field}
                id="scheduledAt"
                type="datetime-local"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
    </UncontrolledFormDialog>
  );
}
