"use client";

import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { useUploadVoucherFiles } from "../hooks/useUploadVoucherFiles";

interface VoucherFileUploadDialogProps {
  voucherId: number;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function VoucherFileUploadDialog({
  voucherId,
  trigger,
  onSuccess,
}: VoucherFileUploadDialogProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  
  const uploadFilesMutation = useUploadVoucherFiles();

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    try {
      await uploadFilesMutation.mutateAsync({
        voucherId,
        files,
      });
      
      setFiles([]);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleCancel = () => {
    setFiles([]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Cargar Archivos
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="h-[80%] min-w-[70%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cargar Archivos al Voucher</DialogTitle>
          <DialogDescription>
            Adjunta archivos a este voucher. Puedes cargar múltiples archivos a la vez.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <FileUpload
            maxFiles={10}
            maxSize={10 * 1024 * 1024} // 10MB per file
            className="w-full"
            value={files}
            onValueChange={setFiles}
            onFileReject={onFileReject}
            multiple
          >
            <FileUploadDropzone>
              <div className="flex flex-col items-center gap-2 text-center py-8">
                <div className="flex items-center justify-center rounded-full border p-3">
                  <Upload className="size-8 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">Arrastra y suelta archivos aquí</p>
                <p className="text-muted-foreground text-xs">
                  O haz clic para buscar (máx. 10 archivos, hasta 10MB cada uno)
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2 w-fit">
                  Buscar archivos
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>
            
            <FileUploadList>
              {files.map((file, index) => (
                <FileUploadItem key={index} value={file}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                      <X className="size-4" />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={uploadFilesMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || uploadFilesMutation.isPending}
            >
              {uploadFilesMutation.isPending ? "Cargando..." : "Cargar Archivos"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}