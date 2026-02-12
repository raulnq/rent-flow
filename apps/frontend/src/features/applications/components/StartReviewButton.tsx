import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  startReviewApplicationSchema,
  type StartReviewApplication,
} from '#/features/applications/schemas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlayCircle } from 'lucide-react';

type StartReviewButtonProps = {
  disabled: boolean;
  onStartReview: (data: StartReviewApplication) => void;
};

export function StartReviewButton({
  disabled,
  onStartReview,
}: StartReviewButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<StartReviewApplication>({
    resolver: zodResolver(startReviewApplicationSchema),
    defaultValues: {
      reviewStartedAt: new Date().toISOString().split('T')[0],
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
        <PlayCircle className="h-4 w-4 mr-2" />
        Start Review
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Review</DialogTitle>
            <DialogDescription>
              Please select the date when the review starts.
            </DialogDescription>
          </DialogHeader>
          <form
            id="start-review-form"
            onSubmit={form.handleSubmit(data => {
              onStartReview(data);
              setDialogOpen(false);
              form.reset();
            })}
          >
            <Controller
              name="reviewStartedAt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reviewStartedAt">Date</FieldLabel>
                  <Input
                    {...field}
                    id="reviewStartedAt"
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
            <Button type="submit" form="start-review-form">
              Start Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
