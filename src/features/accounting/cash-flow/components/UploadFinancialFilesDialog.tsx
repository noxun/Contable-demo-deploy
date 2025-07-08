"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { uploadBalanceSheetFile, uploadStatementIncomeFile } from "@/features/accounting/cash-flow/services/service";
import { LoaderIcon } from "lucide-react";

interface UploadFinancialFilesDialogProps {
  onUploadSuccess?: () => void;
}

export function UploadFinancialFilesDialog({
  onUploadSuccess,
}: UploadFinancialFilesDialogProps) {
  const [incomeFile, setIncomeFile] = useState<File | null>(null);
  const [balanceFile, setBalanceFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inSus, setInSus] = useState<boolean>(false);

  const uploadBalanceSheetMutation = useMutation({
    mutationFn: (data: { file: File; inSus: boolean }) => 
      uploadBalanceSheetFile(data.file, data.inSus),
    onSuccess: () => {
      toast.success("Balance de gestión subido exitosamente");
    },
    onError: (error) => {
      console.error("Error uploading balance sheet:", error);
      toast.error("Error al subir el balance de gestión");
    },
  });

  const uploadStatementIncomeMutation = useMutation({
    mutationFn: (data: { file: File; inSus: boolean }) => 
      uploadStatementIncomeFile(data.file, data.inSus),
    onSuccess: () => {
      toast.success("Estado de gestión de ingresos subido exitosamente");
    },
    onError: (error) => {
      console.error("Error uploading statement income:", error);
      toast.error("Error al subir el estado de gestión de ingresos");
    },
  });

  const resetFiles = () => {
    setIncomeFile(null);
    setBalanceFile(null);
  };

  const handleFileChange = (type: "income" | "balance", file: File | null) => {
    if (type === "income") {
      setIncomeFile(file);
    } else {
      setBalanceFile(file);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!incomeFile || !balanceFile) {
      toast.error("Por favor selecciona ambos archivos.");
      return;
    }

    try {
      // Upload both files concurrently
      const uploadPromises = [
        uploadStatementIncomeMutation.mutateAsync({ 
          file: incomeFile, 
          inSus 
        }),
        uploadBalanceSheetMutation.mutateAsync({ 
          file: balanceFile, 
          inSus 
        })
      ];

      await Promise.all(uploadPromises);
      
      toast.success('Ambos archivos subidos exitosamente');
      
      // Reset form and close dialog
      resetFiles();
      setIsOpen(false);
      
      // Notify parent component that upload was successful
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error al subir los archivos");
    }
  };

  const isUploading = uploadBalanceSheetMutation.isPending || uploadStatementIncomeMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          Subir Archivos Financieros
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleFileUpload}>
          <DialogHeader>
            <DialogTitle>Subir Archivos Financieros</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="inSus" 
                  checked={inSus}
                  onCheckedChange={(checked) => setInSus(checked === true)}
                  disabled={isUploading}
                />
                <Label htmlFor="inSus">En Dolares?</Label>
              </div>
            </div>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="incomeFile">Estado de Gestión de Ingresos</Label>
              <Input
                id="incomeFile"
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => handleFileChange("income", e.target.files?.[0] || null)}
                required
                disabled={isUploading}
              />
              {incomeFile && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✓ {incomeFile.name}
                </p>
              )}
            </div>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="balanceFile">Balance de Gestión</Label>
              <Input
                id="balanceFile"
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => handleFileChange("balance", e.target.files?.[0] || null)}
                required
                disabled={isUploading}
              />
              {balanceFile && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✓ {balanceFile.name}
                </p>
              )}
            </div>
            {(incomeFile || balanceFile) && !isUploading && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetFiles}
                className="w-full"
              >
                Limpiar archivos seleccionados
              </Button>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isUploading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <LoaderIcon className="animate-spin mr-2 h-4 w-4" />
                  Subiendo...
                </>
              ) : (
                "Subir Archivos"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}