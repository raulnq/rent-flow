import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useRef, useState } from 'react';
import { Upload, ImageOff, Loader2, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Image = {
  id: string;
  path: string;
};

type ImageUploaderProps = {
  images: Image[];
  onAdd?: (files: FileList | null) => Promise<void>;
  onRemove?: (id: string) => Promise<void>;
};

export function ImageUploaderSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-xl" />
      ))}
    </div>
  );
}

export function ImageUploader({ images, onAdd, onRemove }: ImageUploaderProps) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = async (files: FileList | null) => {
    if (!onAdd || !files?.length) return;

    try {
      setIsUploading(true);
      await onAdd(files);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemove = async (id: string) => {
    if (!onRemove || removingId) return;
    setRemovingId(id);
    try {
      await onRemove(id);
    } finally {
      setRemovingId(null);
    }
  };

  const isEmpty = images.length === 0;

  return (
    <>
      {/* Image Count */}
      {images.length > 0 && (
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {images.length} {images.length === 1 ? 'image' : 'images'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-5 gap-3">
        {onAdd && (
          <Card
            className="border-dashed border-2 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/40 transition aspect-square"
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="mb-1 h-6 w-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center px-1">
                  Upload
                </p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={e => handleAdd(e.target.files)}
            />
          </Card>
        )}

        {isEmpty && !onAdd && (
          <div className="col-span-5 flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
            <ImageOff className="h-8 w-8" />
            <p className="text-sm">No images</p>
          </div>
        )}

        {images.map((image, index) => (
          <div key={image.id} className="relative aspect-square">
            <img
              src={image.path}
              alt={`Image ${index + 1}`}
              loading="lazy"
              className="rounded-xl object-cover w-full h-full cursor-pointer hover:scale-105 transition"
              onClick={() => {
                setSelectedIndex(index);
                setOpen(true);
              }}
            />
            {onRemove && (
              <button
                type="button"
                disabled={removingId !== null}
                onClick={() => handleRemove(image.id)}
                aria-label="Remove image"
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 transition hover:bg-black/80 disabled:cursor-not-allowed"
              >
                {removingId === image.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <X className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] sm:max-w-6xl max-w-none">
          <DialogTitle className="sr-only">Image preview</DialogTitle>
          {images.length > 0 && (
            <Carousel
              key={selectedIndex}
              opts={{ startIndex: selectedIndex, loop: true }}
            >
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={image.id} className="w-full">
                    <div className="flex items-center justify-center h-[85vh] w-full">
                      <img
                        src={image.path}
                        alt={`Preview image ${index + 1}`}
                        className="h-full w-full object-contain rounded-xl"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
