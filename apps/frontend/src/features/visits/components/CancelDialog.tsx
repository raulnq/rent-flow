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
import type { CancelVisit } from '#/features/visits/schemas';
import { cancelVisitSchema } from '#/features/visits/schemas';

type CancelDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: (data: CancelVisit) => Promise<void>;
};

export function CancelDialog({
  isOpen,
  onOpenChange,
  onCancel,
}: CancelDialogProps) {
  const form = useForm<CancelVisit>({
    resolver: zodResolver(cancelVisitSchema),
    defaultValues: {
      cancellationReason: '',
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  const handleSubmit = async (data: CancelVisit) => {
    await onCancel(data);
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Visit</DialogTitle>
          <DialogDescription>
            Please provide a reason for cancelling this visit.
          </DialogDescription>
        </DialogHeader>
        <form
          id="cancel-visit-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <Controller
            name="cancellationReason"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cancellationReason">Reason</FieldLabel>
                <Textarea
                  {...field}
                  id="cancellationReason"
                  placeholder="Enter cancellation reason..."
                  rows={4}
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
          <Button type="submit" form="cancel-visit-form" variant="destructive">
            Cancel Visit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
