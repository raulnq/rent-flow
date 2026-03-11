import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Client } from '#/features/clients/schemas';
import { FormCard } from '@/components/FormCard';
import { EditButton } from '@/components/EditButton';

type ViewClientCardProps = {
  client: Client;
  onCancel: () => void;
};

export function ViewClientCard({ client, onCancel }: ViewClientCardProps) {
  return (
    <FormCard
      onCancel={onCancel}
      title="View Client"
      description="View an existing client."
      readOnly={true}
      renderAction={
        <EditButton text="Edit" link={`/clients/${client.clientId}/edit`} />
      }
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input value={client.name} disabled />
        </Field>
        <Field>
          <FieldLabel>DNI</FieldLabel>
          <Input value={client.dni} disabled />
        </Field>
        <Field>
          <FieldLabel>Phone</FieldLabel>
          <Input value={client.phone} disabled />
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input value={client.email ?? ''} disabled />
        </Field>
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Textarea value={client.address ?? ''} disabled rows={3} />
        </Field>
      </FieldGroup>
    </FormCard>
  );
}
