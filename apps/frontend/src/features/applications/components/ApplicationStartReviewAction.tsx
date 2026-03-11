import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import {
  startReviewApplicationSchema,
  type StartReviewApplication,
} from '#/features/applications/schemas';
import { PlayCircle } from 'lucide-react';

type ApplicationStartReviewActionProps = {
  disabled: boolean;
  isPending: boolean;
  onStartReview: (data: StartReviewApplication) => void;
};

export function ApplicationStartReviewAction({
  disabled,
  isPending,
  onStartReview,
}: ApplicationStartReviewActionProps) {
  return (
    <UncontrolledFormDialog
      schema={startReviewApplicationSchema}
      defaultValues={{
        reviewStartedAt: new Date().toISOString().split('T')[0],
      }}
      onSubmit={onStartReview}
      isPending={isPending}
      label="Start Review"
      saveLabel="Start Review"
      description="Please select the date when the review starts."
      icon={<PlayCircle className="h-4 w-4" />}
      disabled={disabled}
    >
      {form => (
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
    </UncontrolledFormDialog>
  );
}
