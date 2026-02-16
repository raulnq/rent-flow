import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { Client } from '#/features/clients/schemas';
import { ViewCardContent } from '@/components/ViewCardContent';
import { Textarea } from '@/components/ui/textarea';

type ViewClientCardProps = {
  client: Client;
};

export function ViewClientCard({ client }: ViewClientCardProps) {
  return (
    <ViewCardContent>
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
    </ViewCardContent>
  );
}
