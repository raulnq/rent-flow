import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  addPropertySchema,
  type AddProperty,
} from '#/features/properties/schemas';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ClientCombobox } from '@/features/clients/components/ClientCombobox';
import { LocationMapField } from './LocationMapField';

type AddPropertyFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<AddProperty>;
};

export function AddPropertyForm({ isPending, onSubmit }: AddPropertyFormProps) {
  const navigate = useNavigate();
  const form = useForm<AddProperty>({
    resolver: zodResolver(addPropertySchema),
    defaultValues: {
      address: '',
      propertyType: 'Apartment',
      clientId: '',
      rentalPrice: 0,
      numberOfRooms: 0,
      numberOfBathrooms: 0,
      numberOfGarages: 0,
      totalArea: 0,
      description: null,
      constraints: null,
      latitude: null,
      longitude: null,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Textarea
                  {...field}
                  id="address"
                  aria-invalid={fieldState.invalid}
                  placeholder="Property address"
                  disabled={isPending}
                  rows={2}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="propertyType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="propertyType">Property Type</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="clientId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Client (Owner)</FieldLabel>
                <ClientCombobox
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
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="rentalPrice"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="rentalPrice">Rental Price</FieldLabel>
                  <Input
                    {...field}
                    id="rentalPrice"
                    type="number"
                    step="0.01"
                    value={field.value ?? ''}
                    onChange={e => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                    placeholder="0.00"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="totalArea"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="totalArea">Total Area (m²)</FieldLabel>
                  <Input
                    {...field}
                    id="totalArea"
                    type="number"
                    step="0.01"
                    value={field.value ?? ''}
                    onChange={e => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                    placeholder="0.00"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="numberOfRooms"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="numberOfRooms">Rooms</FieldLabel>
                  <Input
                    {...field}
                    id="numberOfRooms"
                    type="number"
                    value={field.value ?? ''}
                    onChange={e => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                    placeholder="0"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="numberOfBathrooms"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="numberOfBathrooms">Bathrooms</FieldLabel>
                  <Input
                    {...field}
                    id="numberOfBathrooms"
                    type="number"
                    value={field.value ?? ''}
                    onChange={e => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                    placeholder="0"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="numberOfGarages"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="numberOfGarages">Garages</FieldLabel>
                  <Input
                    {...field}
                    id="numberOfGarages"
                    type="number"
                    value={field.value ?? ''}
                    onChange={e => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                    placeholder="0"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value || null)}
                  aria-invalid={fieldState.invalid}
                  placeholder="Description (optional)"
                  disabled={isPending}
                  rows={3}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="constraints"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="constraints">Constraints</FieldLabel>
                <Textarea
                  {...field}
                  id="constraints"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value || null)}
                  aria-invalid={fieldState.invalid}
                  placeholder="Constraints (optional)"
                  disabled={isPending}
                  rows={3}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <LocationMapField control={form.control} disabled={isPending} />
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/properties')}
          >
            Cancel
          </Button>
          <Button type="submit" form="form" disabled={isPending}>
            Save Property
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
