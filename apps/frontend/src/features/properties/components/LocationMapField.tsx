import { lazy, Suspense } from 'react';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { useController, type Control } from 'react-hook-form';
import type { AddProperty } from '#/features/properties/schemas';
import type { EditProperty } from '#/features/properties/schemas';

const MapEditor = lazy(() =>
  import('../../../components/MapEditor').then(module => ({
    default: module.MapEditor,
  }))
);

type LocationMapFieldProps = {
  control: Control<AddProperty> | Control<EditProperty>;
  disabled?: boolean;
};

function MapEditorSkeleton() {
  return (
    <div className="h-[400px] bg-muted rounded-md animate-pulse border border-border" />
  );
}

export function LocationMapField({ control, disabled }: LocationMapFieldProps) {
  const { field: latField, fieldState: latFieldState } = useController({
    name: 'latitude',
    control: control as Control<AddProperty | EditProperty>,
  });

  const { field: lngField } = useController({
    name: 'longitude',
    control: control as Control<AddProperty | EditProperty>,
  });

  const handleChange = (coords: {
    latitude: number | null;
    longitude: number | null;
  }) => {
    latField.onChange(coords.latitude);
    lngField.onChange(coords.longitude);
  };

  return (
    <Field data-invalid={latFieldState.invalid}>
      <FieldLabel htmlFor="location-map">Location</FieldLabel>
      <p className="text-sm text-muted-foreground mb-2">
        Use the search control on the map to find an address, or drag the marker
        to set the exact location.
      </p>
      <Suspense fallback={<MapEditorSkeleton />}>
        <MapEditor
          latitude={latField.value}
          longitude={lngField.value}
          onChange={handleChange}
          disabled={disabled}
        />
      </Suspense>
      {(latField.value !== null || lngField.value !== null) && (
        <p className="text-sm text-muted-foreground mt-2">
          Coordinates: {latField.value?.toFixed(6) ?? '—'},{' '}
          {lngField.value?.toFixed(6) ?? '—'}
        </p>
      )}
      {latFieldState.invalid && latFieldState.error && (
        <FieldError errors={[latFieldState.error]} />
      )}
    </Field>
  );
}
