import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Lead } from '#/features/leads/schemas';
import { FormCard } from '@/components/FormCard';
import { EditButton } from '@/components/EditButton';

type ViewLeadCardProps = {
  lead: Lead;
  onCancel: () => void;
};

export function ViewLeadCard({ lead, onCancel }: ViewLeadCardProps) {
  return (
    <FormCard
      onCancel={onCancel}
      title="View Lead"
      description="View an existing lead."
      readOnly={true}
      renderAction={
        <EditButton text="Edit" link={`/leads/${lead.leadId}/edit`} />
      }
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input value={lead.name} disabled />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>DNI</FieldLabel>
            <Input value={lead.dni} disabled />
          </Field>
          <Field>
            <FieldLabel>Birth Date</FieldLabel>
            <Input value={lead.birthDate ?? ''} disabled />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Nationality</FieldLabel>
            <Input value={lead.nationality ?? ''} disabled />
          </Field>
          <Field>
            <FieldLabel>Occupation</FieldLabel>
            <Input value={lead.occupation ?? ''} disabled />
          </Field>
        </div>
        <FieldSeparator />
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input value={lead.email ?? ''} disabled />
          </Field>
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input value={lead.phone} disabled />
          </Field>
        </div>
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Textarea value={lead.address ?? ''} disabled rows={3} />
        </Field>
        <FieldSeparator />
        <Field>
          <FieldLabel>Additional Notes</FieldLabel>
          <Textarea value={lead.notes ?? ''} disabled rows={3} />
        </Field>
      </FieldGroup>
    </FormCard>
  );
}
