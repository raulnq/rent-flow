import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
};

export function AddDocumentButton({ onAdd }: AddButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const form = useForm<AddDocument>({
    resolver: zodResolver(addDocumentSchema),
    defaultValues: {
      documentType: 'Identity document',
    },
  });

  const handleSubmit = async (data: AddDocument) => {
    await onAdd(data);
    setDialogOpen(false);
    setSelectedFileName('');
    form.reset();
  };

  return (
    <>
      <Button onClick={() => setDialogOpen(true)} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Document
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document for this application.
            </DialogDescription>
          </DialogHeader>
          <form
            id="add-document-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
                      <SelectItem value="Credit report">
                        Credit report
                      </SelectItem>
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
                  <div className="flex items-center gap-2">
                    <Input
                      {...field}
                      id="file"
                      type="file"
                      accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                          setSelectedFileName(file.name);
                        }
                      }}
                      aria-invalid={fieldState.invalid}
                    />
                  </div>
                  {selectedFileName && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {selectedFileName}
                    </p>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 50MB. Supported: Images, PDF, Word documents
                  </p>
                </Field>
              )}
            />
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setSelectedFileName('');
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="add-document-form">
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
