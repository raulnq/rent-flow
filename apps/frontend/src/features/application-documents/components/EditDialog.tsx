import { Controller } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { ControlledFormDialog } from '@/components/ControlledFormDialog';
import type { EditApplicationDocument } from '#/features/application-documents/schemas';
import { editApplicationDocumentSchema } from '#/features/application-documents/schemas';

type EditApplicationDocumentDialogProps = {
  notes: string | null | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (data: EditApplicationDocument) => Promise<void>;
  isPending: boolean;
};

export function EditDialog({
  notes,
  isOpen,
  onOpenChange,
  onEdit,
  isPending,
}: EditApplicationDocumentDialogProps) {
  return (
    <ControlledFormDialog
      schema={editApplicationDocumentSchema}
      defaultValues={{
        notes: notes ?? null,
      }}
      open={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onEdit}
      isPending={isPending}
      label="Edit Document"
      saveLabel="Update"
      description="Update the document notes"
    >
      {form => (
        <Controller
          name="notes"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea
                {...field}
                id="notes"
                value={field.value ?? ''}
                className="field-sizing-fixed min-h-48"
                placeholder="Add notes about this document..."
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
    </ControlledFormDialog>
  );
}
