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
import { toast } from "sonner";
import { uploadFinancialStateFiles } from "@/features/accounting/cash-flow/services/service";

interface UploadFinancialFilesDialogProps {
  onFilesSelected: (files: {
    incomeFile: File | null;
    balanceFile: File | null;
  }) => void;
}

export function UploadFinancialFilesDialog({
  onFilesSelected,
}: UploadFinancialFilesDialogProps) {
  const [incomeFile, setIncomeFile] = useState<File | null>(null);
  const [balanceFile, setBalanceFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const resetFiles = () => {
    setIncomeFile(null);
    setBalanceFile(null);
    onFilesSelected({ incomeFile: null, balanceFile: null });
  };

  const handleFileChange = (type: "income" | "balance", file: File | null) => {
    if (type === "income") {
      setIncomeFile(file);
    } else {
      setBalanceFile(file);
    }
    onFilesSelected({
      incomeFile: type === "income" ? file : incomeFile,
      balanceFile: type === "balance" ? file : balanceFile,
    });
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    if (!incomeFile || !balanceFile) {
      toast.error("Por favor selecciona ambos archivos.");
      setIsUploading(false);
      return;
    }

    try {
      const result = await uploadFinancialStateFiles({
        incomeStatementFile: incomeFile,
        balanceSheetFile: balanceFile,
      });
      console.log('Upload successful:', result);
      toast.success('Archivos subidos correctamente');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Error al subir los archivos');
    } finally {
      setIsUploading(false);
      // Don't reset files on successful upload, keep them for cash flow generation
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          {incomeFile && balanceFile ? "Archivos Subidos ✓" : "Subir Archivos"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleFileUpload}>
          <DialogHeader>
            <DialogTitle>
              {incomeFile && balanceFile ? "Gestionar Archivos Financieros" : "Subir Archivos Financieros"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="incomeFile">Estado de Gestión de Ingresos</Label>
              <Input
                id="incomeFile"
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => handleFileChange("income", e.target.files?.[0] || null)}
                required
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
              />
              {balanceFile && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✓ {balanceFile.name}
                </p>
              )}
            </div>
            {(incomeFile || balanceFile) && (
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
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Subiendo..." : "Subir Archivos"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}