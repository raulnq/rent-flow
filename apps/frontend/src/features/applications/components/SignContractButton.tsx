import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  signContractApplicationSchema,
  type SignContractApplication,
} from '#/features/applications/schemas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText } from 'lucide-react';

type SignContractButtonProps = {
  disabled: boolean;
  onSignContract: (data: SignContractApplication) => void;
};

export function SignContractButton({
  disabled,
  onSignContract,
}: SignContractButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<SignContractApplication>({
    resolver: zodResolver(signContractApplicationSchema),
    defaultValues: {
      contractSignedAt: new Date().toISOString().split('T')[0],
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
        <FileText className="h-4 w-4 mr-2" />
        Sign Contract
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Contract</DialogTitle>
            <DialogDescription>
              Please select the date when the contract was signed.
            </DialogDescription>
          </DialogHeader>
          <form
            id="sign-contract-form"
            onSubmit={form.handleSubmit(data => {
              onSignContract(data);
              setDialogOpen(false);
              form.reset();
            })}
          >
            <Controller
              name="contractSignedAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contractSignedAt">Date</FieldLabel>
                  <Input
                    {...field}
                    id="contractSignedAt"
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
            <Button type="submit" form="sign-contract-form">
              Sign Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
