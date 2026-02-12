import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  rejectApplicationSchema,
  type RejectApplication,
} from '#/features/applications/schemas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { XCircle } from 'lucide-react';

type RejectButtonProps = {
  disabled: boolean;
  onReject: (data: RejectApplication) => void;
};

export function RejectButton({ disabled, onReject }: RejectButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<RejectApplication>({
    resolver: zodResolver(rejectApplicationSchema),
    defaultValues: {
      rejectedReason: '',
      rejectedAt: new Date().toISOString().split('T')[0],
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
        <XCircle className="h-4 w-4 mr-2" />
        Reject
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application.
            </DialogDescription>
          </DialogHeader>
          <form
            id="reject-form"
            onSubmit={form.handleSubmit(data => {
              onReject(data);
              setDialogOpen(false);
              form.reset();
            })}
            className="space-y-4"
          >
            <Controller
              name="rejectedReason"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="rejectedReason">Reason</FieldLabel>
                  <Textarea
                    {...field}
                    id="rejectedReason"
                    placeholder="Enter rejection reason..."
                    rows={4}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="rejectedAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="rejectedAt">Date</FieldLabel>
                  <Input
                    {...field}
                    id="rejectedAt"
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
            <Button type="submit" form="reject-form" variant="destructive">
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
