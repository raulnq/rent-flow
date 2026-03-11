import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { ControlledFormDialog } from '@/components/ControlledFormDialog';
import { z } from 'zod';

const editVisitFormSchema = z.object({
  scheduledAt: z.string().min(1, 'Scheduled time is required'),
  notes: z.string().nullable(),
});

type EditVisitForm = z.infer<typeof editVisitFormSchema>;

type VisitEditActionProps = {
  scheduledAt: Date | undefined;
  notes: string | null | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (data: EditVisitForm) => Promise<void>;
  isPending: boolean;
};

export function VisitEditAction({
  scheduledAt,
  notes,
  isOpen,
  onOpenChange,
  onEdit,
  isPending,
}: VisitEditActionProps) {
  return (
    <ControlledFormDialog
      schema={editVisitFormSchema}
      defaultValues={{
        scheduledAt: scheduledAt
          ? new Date(scheduledAt).toISOString().slice(0, 16)
          : '',
        notes: notes ?? '',
      }}
      open={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onEdit}
      isPending={isPending}
      label="Edit Visit"
      saveLabel="Update"
      description="Update the visit scheduled time and notes."
    >
      {form => (
        <>
          <Controller
            name="scheduledAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-scheduledAt">Scheduled At</FieldLabel>
                <Input
                  {...field}
                  id="edit-scheduledAt"
                  type="datetime-local"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-notes">Notes</FieldLabel>
                <Textarea
                  {...field}
                  id="edit-notes"
                  placeholder="Enter notes..."
                  className="field-sizing-fixed min-h-48"
                  value={field.value ?? ''}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </>
      )}
    </ControlledFormDialog>
  );
}
