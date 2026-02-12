import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  withdrawApplicationSchema,
  type WithdrawApplication,
} from '#/features/applications/schemas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserX } from 'lucide-react';

type WithdrawButtonProps = {
  disabled: boolean;
  onWithdraw: (data: WithdrawApplication) => void;
};

export function WithdrawButton({ disabled, onWithdraw }: WithdrawButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<WithdrawApplication>({
    resolver: zodResolver(withdrawApplicationSchema),
    defaultValues: {
      withdrawnReason: '',
      withdrawnAt: new Date().toISOString().split('T')[0],
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
        <UserX className="h-4 w-4 mr-2" />
        Withdraw
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for withdrawing this application.
            </DialogDescription>
          </DialogHeader>
          <form
            id="withdraw-form"
            onSubmit={form.handleSubmit(data => {
              onWithdraw(data);
              setDialogOpen(false);
              form.reset();
            })}
            className="space-y-4"
          >
            <Controller
              name="withdrawnReason"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="withdrawnReason">Reason</FieldLabel>
                  <Textarea
                    {...field}
                    id="withdrawnReason"
                    placeholder="Enter withdrawal reason..."
                    rows={4}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="withdrawnAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="withdrawnAt">Date</FieldLabel>
                  <Input
                    {...field}
                    id="withdrawnAt"
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
            <Button type="submit" form="withdraw-form">
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
