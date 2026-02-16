import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';
import {
  editApplicationSchema,
  type EditApplication,
  type Application,
} from '#/features/applications/schemas';
import { FormCardContent } from '@/components/FormCardContent';

type EditApplicationFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditApplication>;
  application: Application;
};

export function EditApplicationForm({
  isPending,
  onSubmit,
  application,
}: EditApplicationFormProps) {
  const form = useForm<EditApplication>({
    resolver: zodResolver(editApplicationSchema),
    defaultValues: {
      applicationId: application.applicationId,
      notes: application.notes,
    },
  });

  return (
    <FormCardContent formId="form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel>Property</FieldLabel>
          <Input value={application.propertyAddress ?? 'N/A'} disabled />
        </Field>
        <Field>
          <FieldLabel>Lead</FieldLabel>
          <Input value={application.leadName ?? 'N/A'} disabled />
        </Field>
        <FieldSeparator />
        <Controller
          name="notes"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="notes">Additional Notes</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ''}
                id="notes"
                aria-invalid={fieldState.invalid}
                placeholder="Notes (optional)"
                disabled={isPending}
                rows={3}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <FieldSeparator />
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Created At</FieldLabel>
            <Input
              value={new Date(application.createdAt).toLocaleString()}
              disabled
            />
          </Field>
          {application.reviewStartedAt && (
            <Field>
              <FieldLabel>Review Started At</FieldLabel>
              <Input value={application.reviewStartedAt} disabled />
            </Field>
          )}
        </div>
        {(application.approvedAt || application.contractSignedAt) && (
          <div className="grid grid-cols-2 gap-4">
            {application.approvedAt && (
              <Field>
                <FieldLabel>Approved At</FieldLabel>
                <Input value={application.approvedAt} disabled />
              </Field>
            )}
            {application.contractSignedAt && (
              <Field>
                <FieldLabel>Contract Signed At</FieldLabel>
                <Input value={application.contractSignedAt} disabled />
              </Field>
            )}
          </div>
        )}
        {application.reservedAt && (
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Reserved At</FieldLabel>
              <Input value={application.reservedAt} disabled />
            </Field>
            <Field>
              <FieldLabel>Reserved Amount</FieldLabel>
              <Input
                value={
                  application.reservedAmount
                    ? `$${application.reservedAmount.toFixed(2)}`
                    : 'N/A'
                }
                disabled
              />
            </Field>
          </div>
        )}
        {application.rejectedAt && (
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Rejected At</FieldLabel>
              <Input value={application.rejectedAt} disabled />
            </Field>
            <Field>
              <FieldLabel>Rejected Reason</FieldLabel>
              <Textarea
                value={application.rejectedReason ?? ''}
                disabled
                rows={2}
              />
            </Field>
          </div>
        )}
        {application.withdrawnAt && (
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Withdrawn At</FieldLabel>
              <Input value={application.withdrawnAt} disabled />
            </Field>
            <Field>
              <FieldLabel>Withdrawn Reason</FieldLabel>
              <Textarea
                value={application.withdrawnReason ?? ''}
                disabled
                rows={2}
              />
            </Field>
          </div>
        )}
      </FieldGroup>
    </FormCardContent>
  );
}
