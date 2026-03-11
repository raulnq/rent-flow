import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { UncontrolledFormDialog } from '@/components/UncontrolledFormDialog';
import { Plus } from 'lucide-react';
import { z } from 'zod';
import { addApplicationDocumentSchema } from '#/features/application-documents/schemas';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const addDocumentSchema = addApplicationDocumentSchema.extend({
  file: z.instanceof(File, { message: 'File is required' }),
});

type AddDocument = z.infer<typeof addDocumentSchema>;

type AddButtonProps = {
  onAdd: (data: AddDocument) => Promise<void>;
  isPending: boolean;
};

export function AddDocumentButton({ onAdd, isPending }: AddButtonProps) {
  return (
    <UncontrolledFormDialog
      schema={addDocumentSchema}
      defaultValues={{
        documentType: 'Identity document',
      }}
      onSubmit={onAdd}
      isPending={isPending}
      label="Add Document"
      saveLabel="Add"
      description="Upload a document for this application."
      icon={<Plus className="h-4 w-4" />}
    >
      {form => (
        <>
          <Controller
            name="documentType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="documentType">Document Type</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Identity document">
                      Identity document
                    </SelectItem>
                    <SelectItem value="Credit report">Credit report</SelectItem>
                    <SelectItem value="Pay stubs">Pay stubs</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="file"
            control={form.control}
            render={({
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              field: { onChange, value, ...field },
              fieldState,
            }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="file">File</FieldLabel>
                <Input
                  {...field}
                  id="file"
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Max 50MB. Supported: Images, PDF, Word documents
                </p>
              </Field>
            )}
          />
        </>
      )}
    </UncontrolledFormDialog>
  );
}
