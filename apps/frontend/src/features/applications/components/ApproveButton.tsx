import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  approveApplicationSchema,
  type ApproveApplication,
} from '#/features/applications/schemas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

type ApproveButtonProps = {
  disabled: boolean;
  onApprove: (data: ApproveApplication) => void;
};

export function ApproveButton({ disabled, onApprove }: ApproveButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<ApproveApplication>({
    resolver: zodResolver(approveApplicationSchema),
    defaultValues: {
      approvedAt: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <>
      <Button
        type="button"
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        variant="default"
        size="sm"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Approve
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>
              Please select the approval date.
            </DialogDescription>
          </DialogHeader>
          <form
            id="approve-form"
            onSubmit={form.handleSubmit(data => {
              onApprove(data);
              setDialogOpen(false);
              form.reset();
            })}
          >
            <Controller
              name="approvedAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="approvedAt">Date</FieldLabel>
                  <Input
                    {...field}
                    id="approvedAt"
                    type="date"
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
            <Button type="submit" form="approve-form">
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
