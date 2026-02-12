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
  editPropertySchema,
  type EditProperty,
  type Property,
} from '#/features/properties/schemas';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientCombobox } from '@/features/clients/components/ClientCombobox';
import { LocationMapField } from './LocationMapField';

export function EditPropertyError({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="text-center py-8">
      <p className="text-destructive mb-4">Failed to load property.</p>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}

export function EditPropertySkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end gap-2 w-full">
          <Skeleton className="h-10 w-[80px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </CardFooter>
    </Card>
  );
}

type EditPropertyFormProps = {
  isPending: boolean;
  onSubmit: SubmitHandler<EditProperty>;
  property: Property;
};

export function EditPropertyForm({
  isPending,
  onSubmit,
  property,
}: EditPropertyFormProps) {
  const navigate = useNavigate();

  const form = useForm<EditProperty>({
    resolver: zodResolver(editPropertySchema),
    defaultValues: property,
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
                  label={property.clientName}
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
              name="rooms"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="rooms">Rooms</FieldLabel>
                  <Input
                    {...field}
                    id="rooms"
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
              name="bathrooms"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="bathrooms">Bathrooms</FieldLabel>
                  <Input
                    {...field}
                    id="bathrooms"
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
              name="parkingSpaces"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="parkingSpaces">
                    Parking Spaces
                  </FieldLabel>
                  <Input
                    {...field}
                    id="parkingSpaces"
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
          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="builtArea"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="builtArea">Built Area (m²)</FieldLabel>
                  <Input
                    {...field}
                    id="builtArea"
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
              name="floorNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="floorNumber">Floor Number</FieldLabel>
                  <Input
                    {...field}
                    id="floorNumber"
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
              name="yearBuilt"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="yearBuilt">Year Built</FieldLabel>
                  <Input
                    {...field}
                    id="yearBuilt"
                    type="number"
                    value={field.value ?? ''}
                    onChange={e => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                    placeholder="2024"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="maintenanceFee"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="maintenanceFee">
                    Maintenance Fee
                  </FieldLabel>
                  <Input
                    {...field}
                    id="maintenanceFee"
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
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="InProcess">In Process</SelectItem>
                      <SelectItem value="Rented">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="minimumContractMonths"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="minimumContractMonths">
                    Min Contract (months)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="minimumContractMonths"
                    type="number"
                    value={field.value ?? ''}
                    onChange={e => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                    placeholder="12"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="depositMonths"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="depositMonths">
                    Deposit (months)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="depositMonths"
                    type="number"
                    value={field.value ?? ''}
                    onChange={e => field.onChange(Number(e.target.value))}
                    aria-invalid={fieldState.invalid}
                    placeholder="2"
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
              name="hasElevator"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="hasElevator">Has Elevator</FieldLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={v => field.onChange(v === 'true')}
                    disabled={isPending}
                  >
                    <SelectTrigger id="hasElevator">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="allowPets"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="allowPets">Allow Pets</FieldLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={v => field.onChange(v === 'true')}
                    disabled={isPending}
                  >
                    <SelectTrigger id="allowPets">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="allowKids"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="allowKids">Allow Kids</FieldLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={v => field.onChange(v === 'true')}
                    disabled={isPending}
                  >
                    <SelectTrigger id="allowKids">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
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
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="notes">Notes</FieldLabel>
                <Textarea
                  {...field}
                  id="notes"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value || null)}
                  aria-invalid={fieldState.invalid}
                  placeholder="Notes (optional)"
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
