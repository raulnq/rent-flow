import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { z } from 'zod';

const editVisitFormSchema = z.object({
  scheduledAt: z.string().min(1, 'Scheduled time is required'),
  notes: z.string().nullable(),
});

type EditVisitForm = z.infer<typeof editVisitFormSchema>;

type EditDialogProps = {
  scheduledAt: Date | undefined;
  notes: string | null | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (data: EditVisitForm) => Promise<void>;
};

export function EditDialog({
  scheduledAt,
  notes,
  isOpen,
  onOpenChange,
  onEdit,
}: EditDialogProps) {
  const form = useForm<EditVisitForm>({
    resolver: zodResolver(editVisitFormSchema),
    defaultValues: {
      scheduledAt: scheduledAt
        ? new Date(scheduledAt).toISOString().slice(0, 16)
        : '',
      notes: notes ?? '',
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  const handleSubmit = async (data: EditVisitForm) => {
    await onEdit(data);
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Visit</DialogTitle>
          <DialogDescription>
            Update the visit scheduled time and notes.
          </DialogDescription>
        </DialogHeader>
        <form
          id="edit-visit-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
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
                  rows={4}
                  value={field.value ?? ''}
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
          <Button type="submit" form="edit-visit-form">
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
