import { ControlledConfirmDialog } from '@/components/ControlledConfirmDialog';

type DocumentDeleteActionProps = {
  fileName: string | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
  isPending: boolean;
};

export function DocumentDeleteAction({
  fileName,
  isOpen,
  onOpenChange,
  onDelete,
  isPending,
}: DocumentDeleteActionProps) {
  return (
    <ControlledConfirmDialog
      label="Delete Document"
      description={`Are you sure you want to delete ${fileName}? This action cannot be undone.`}
      open={isOpen}
      onOpenChange={onOpenChange}
      onConfirm={onDelete}
      isPending={isPending}
    />
  );
}
