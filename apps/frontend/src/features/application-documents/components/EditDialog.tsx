import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { EditApplicationDocument } from '#/features/application-documents/schemas';
import { editApplicationDocumentSchema } from '#/features/application-documents/schemas';

type EditApplicationDocumentDialogProps = {
  notes: string | null | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (data: EditApplicationDocument) => Promise<void>;
};

export function EditDialog({
  notes,
  isOpen,
  onOpenChange,
  onEdit,
}: EditApplicationDocumentDialogProps) {
  const form = useForm<EditApplicationDocument>({
    resolver: zodResolver(editApplicationDocumentSchema),
    defaultValues: {
      notes: notes ?? null,
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  const handleSubmit = async (data: EditApplicationDocument) => {
    await onEdit(data);
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
          <DialogDescription>Update the document notes</DialogDescription>
        </DialogHeader>
        <form
          id="edit-document-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
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
                  onChange={e =>
                    field.onChange(
                      e.target.value === '' ? null : e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Add notes about this document..."
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              handleOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" form="edit-document-form">
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
