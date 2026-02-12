import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  addApplicationSchema,
  type AddApplication,
} from '#/features/applications/schemas';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { LeadCombobox } from '../../leads/components/LeadCombobox';
import { PropertyCombobox } from '../../properties/components/PropertyCombobox';

type AddApplicationFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddApplication>;
};

export function AddApplicationForm({
  isPending,
  onSubmit,
}: AddApplicationFormProps) {
  const navigate = useNavigate();
  const form = useForm<AddApplication>({
    resolver: zodResolver(addApplicationSchema),
    defaultValues: {
      leadId: '',
      propertyId: '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Application Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                Basic Info
              </h3>
              <Separator />
            </div>
            <Controller
              name="propertyId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="propertyId">Property</FieldLabel>
                  <PropertyCombobox
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="leadId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="leadId">Lead</FieldLabel>
                  <LeadCombobox
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/applications')}
          >
            Cancel
          </Button>
          <Button type="submit" form="form" disabled={isPending}>
            Save Application
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
