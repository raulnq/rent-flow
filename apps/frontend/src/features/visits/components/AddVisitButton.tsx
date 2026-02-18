import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus } from 'lucide-react';
import { z } from 'zod';
import type { AddVisit } from '#/features/visits/schemas';

const addVisitFormSchema = z.object({
  scheduledAt: z.string().min(1, 'Scheduled time is required'),
});

type AddButtonProps = {
  onAdd: (data: AddVisit) => Promise<void>;
};

export function AddVisitButton({ onAdd }: AddButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<AddVisit>({
    resolver: zodResolver(addVisitFormSchema),
    defaultValues: {
      scheduledAt: new Date().toISOString().slice(0, 16),
    },
  });

  const handleSubmit = async (data: AddVisit) => {
    await onAdd(data);
    setDialogOpen(false);
    form.reset();
  };

  return (
    <>
      <Button onClick={() => setDialogOpen(true)} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Visit
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Visit</DialogTitle>
            <DialogDescription>
              Schedule a new visit for this application.
            </DialogDescription>
          </DialogHeader>
          <form
            id="add-visit-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
                setDialogOpen(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="add-visit-form">
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
