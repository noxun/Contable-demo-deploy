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
import { uploadFinancialStateFiles } from "@/lib/data";

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
      alert("Por favor selecciona ambos archivos.");
      setIsUploading(false);
      return;
    }

    try {
      const result = await uploadFinancialStateFiles({
        incomeStatementFile: incomeFile,
        balanceSheetFile: balanceFile,
      });
      console.log('Upload successful:', result);
      alert('Archivos subidos correctamente');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Error al subir los archivos');
    } finally {
      setIsUploading(false);
      setIncomeFile(null);
      setBalanceFile(null);
      onFilesSelected({ incomeFile: null, balanceFile: null });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Subir Archivos</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleFileUpload}>
          <DialogHeader>
            <DialogTitle>Subir Archivos Financieros</DialogTitle>
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
            </div>
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