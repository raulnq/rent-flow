import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  reserveApplicationSchema,
  type ReserveApplication,
} from '#/features/applications/schemas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from 'lucide-react';

type ReserveButtonProps = {
  disabled: boolean;
  onReserve: (data: ReserveApplication) => void;
};

export function ReserveButton({ disabled, onReserve }: ReserveButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<ReserveApplication>({
    resolver: zodResolver(reserveApplicationSchema),
    defaultValues: {
      reservedAt: new Date().toISOString().split('T')[0],
      reservedAmount: 0,
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
        <Calendar className="h-4 w-4 mr-2" />
        Reserve
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserve Application</DialogTitle>
            <DialogDescription>
              Please enter the reservation date and amount.
            </DialogDescription>
          </DialogHeader>
          <form
            id="reserve-form"
            onSubmit={form.handleSubmit(data => {
              onReserve(data);
              setDialogOpen(false);
              form.reset();
            })}
          >
            <div className="space-y-4">
              <Controller
                name="reservedAt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reservedAt">Date</FieldLabel>
                    <Input
                      {...field}
                      id="reservedAt"
                      type="date"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="reservedAmount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reservedAmount">Amount</FieldLabel>
                    <Input
                      {...field}
                      id="reservedAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      aria-invalid={fieldState.invalid}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
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
            <Button type="submit" form="reserve-form">
              Reserve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
