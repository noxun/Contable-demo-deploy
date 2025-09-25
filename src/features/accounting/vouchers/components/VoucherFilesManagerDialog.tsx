"use client";

import { Download, Eye, FileIcon, Trash2, Upload } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useVoucherFiles } from "../hooks/useVoucherFiles";
import { useDeleteVoucherFile } from "../hooks/useDeleteVoucherFile";
import { VoucherFileUploadDialog } from "./VoucherFileUploadDialog";
import type { VoucherFile } from "../schemas/voucherFileSchema";

interface VoucherFilesManagerDialogProps {
  voucherId: number;
  trigger?: React.ReactNode;
}

export function VoucherFilesManagerDialog({
  voucherId,
  trigger,
}: VoucherFilesManagerDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const { data: files, isLoading, error, refetch } = useVoucherFiles(voucherId, isOpen);
  const deleteFileMutation = useDeleteVoucherFile();

  const handleDeleteFile = async (fileId: number) => {
    try {
      await deleteFileMutation.mutateAsync(fileId);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleViewFile = (file: VoucherFile) => {
    window.open(file.url, "_blank");
  };

  const handleDownloadFile = (file: VoucherFile) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const getFileTypeColor = (filename: string) => {
    const ext = getFileExtension(filename);
    switch (ext) {
      case "pdf":
        return "bg-red-100 text-red-800";
      case "doc":
      case "docx":
        return "bg-blue-100 text-blue-800";
      case "xls":
      case "xlsx":
        return "bg-green-100 text-green-800";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <FileIcon className="w-4 h-4 mr-2" />
            Administrar Archivos
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Archivos del voucher</DialogTitle>
          <DialogDescription>
            Ver, descargar o eliminar archivos adjuntos a este voucher.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <div className="space-y-4">
            {/* Upload new files section */}
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h4 className="font-medium">Archivos Adjuntos</h4>
                <p className="text-sm text-muted-foreground">
                  {files?.length || 0} archivo(s) adjunto(s)
                </p>
              </div>
              <VoucherFileUploadDialog
                voucherId={voucherId}
                onSuccess={() => refetch()}
                trigger={
                  <Button size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Agregar Archivos
                  </Button>
                }
              />
            </div>

            {/* Files list */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-16" />
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-destructive mb-2">Error al cargar archivos</p>
                <Button variant="outline" onClick={() => refetch()}>
                  Intentar de nuevo
                </Button>
              </div>
            ) : files && files.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map((file) => (
                  <Card key={file.id} className="group hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-medium truncate">
                            {file.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            File ID: {file.id}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getFileTypeColor(file.name)}`}
                        >
                          {getFileExtension(file.name).toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FileIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewFile(file)}
                            title="View file"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDownloadFile(file)}
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                title="Delete file"
                                disabled={deleteFileMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Eliminar Archivo</AlertDialogTitle>
                                <AlertDialogDescription>
                                  ¿Estás seguro de que deseas eliminar &quot;{file.name}&quot;? Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteFile(file.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium mb-2">No hay archivos adjuntos</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Sube archivos para adjuntarlos a este voucher.
                </p>
                <VoucherFileUploadDialog
                  voucherId={voucherId}
                  onSuccess={() => refetch()}
                  trigger={
                    <Button>
                      <Upload className="w-4 h-4 mr-2" />
                      Subir Primer Archivo
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}