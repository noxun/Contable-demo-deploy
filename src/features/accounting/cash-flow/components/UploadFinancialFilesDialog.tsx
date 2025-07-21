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
import { useCashFlowFileOperations } from "@/features/accounting/cash-flow/hooks/useCashFlowQueries";
import { LoaderIcon, CheckCircle, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

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

  const queryClient = useQueryClient();

  const {
    isBalanceConfigured,
    isLoadingBalanceConfig,
    isIncomeConfigured,
    isLoadingIncomeConfig,
    uploadBalanceSheet,
    uploadStatementIncome,
    isUploading,
  } = useCashFlowFileOperations();

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

    if (!balanceFile) {
      toast.error("Por favor selecciona al menos el archivo de Balance General");
      return;
    }

    try {
      // Upload both files concurrently
      const uploadPromises = [];
      
      if (incomeFile) {
        uploadPromises.push(uploadStatementIncome({ 
          file: incomeFile, 
          inSus 
        }));
      }
      
      uploadPromises.push(uploadBalanceSheet({ 
        file: balanceFile, 
        inSus 
      }));

      await Promise.all(uploadPromises);
      
      toast.success('Archivos subidos exitosamente');
      
      // Reset form and close dialog
      resetFiles();
      setIsOpen(false);
      
      // Notify parent component that upload was successful
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      queryClient.invalidateQueries({ queryKey: ["WorkSheetData"] });
      queryClient.invalidateQueries({ queryKey: ['balance-sheet-configured'] });
      queryClient.invalidateQueries({ queryKey: ['statement-income-configured'] });


    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error al subir los archivos");
    }
  };

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
              <div className="flex items-center justify-between">
                <Label htmlFor="incomeFile">Estado de Resultado</Label>
                <div className="flex items-center gap-2">
                  {isLoadingIncomeConfig ? (
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                  ) : isIncomeConfigured ? (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs">Configurado</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <XCircle className="h-4 w-4" />
                      <span className="text-xs">No configurado</span>
                    </div>
                  )}
                </div>
              </div>
              <Input
                id="incomeFile"
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => handleFileChange("income", e.target.files?.[0] || null)}
                disabled={isUploading}
              />
              {incomeFile && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✓ {incomeFile.name}
                </p>
              )}
            </div>
            <div className="grid w-full items-center gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="balanceFile">Balance General</Label>
                <div className="flex items-center gap-2">
                  {isLoadingBalanceConfig ? (
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                  ) : isBalanceConfigured ? (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs">Configurado</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <XCircle className="h-4 w-4" />
                      <span className="text-xs">No configurado</span>
                    </div>
                  )}
                </div>
              </div>
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